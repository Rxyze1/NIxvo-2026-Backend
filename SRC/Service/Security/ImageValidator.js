// Service/Security/ImageValidator.js

import OCRExtractor from '../../Utils/OCRExtractor.js';
import RegexPatterns from '../../Utils/RegexPatterns.js';
import ChatRegexPatterns from '../../Utils/ChatRegexPatterns.js';
import crypto from 'crypto';
import sharp from 'sharp';

// 🆕 TensorFlow + NSFW imports
import * as tf from '@tensorflow/tfjs-node';
import * as nsfw from 'nsfwjs';

class ImageValidator {
  
  // ═══════════════════════════════════════════════════════════════
  // SINGLETON PATTERN
  // ═══════════════════════════════════════════════════════════════
  static #instance = null;
  
  constructor() {
    if (ImageValidator.#instance) {
      return ImageValidator.#instance;
    }
    
    // ═══════════════════════════════════════════════════════
    // CORE SERVICES
    // ═══════════════════════════════════════════════════════
    this.ocr = new OCRExtractor({
      quality: 'fast',
      preprocessImage: true
    });
    
    this.patterns = RegexPatterns;
    
    // ═══════════════════════════════════════════════════════
    // 🆕 NSFW CONFIGURATION
    // ═══════════════════════════════════════════════════════
    this.nsfwModel = null;
    this.nsfwReady = false;
    this.nsfwLoading = false;
    this.nsfwEnabled = true;
    
       this.config = {
      // Basic validation
      minTextLength: 8,
      regexBlockThreshold: 40,
      
      // 🆕 OCR Quality thresholds
      minOcrConfidence: 30,        // Must be > 30% to trust OCR text
      minAlphaNumericRatio: 0.3,   // At least 30% must be letters/numbers
      maxSpecialCharRatio: 0.65,   // Max 65% special characters allowed
      // Caching
      enableCaching: true,
      cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours
      maxCacheSize: 2000, // Increased for 8GB RAM
      
      // Image normalization
      normalizeWidth: 256,
      normalizeQuality: 70,
      
      // 🆕 NSFW Settings (tuned for 8GB VPS)
      nsfwThreshold: 0.5,           // 50% confidence to block
      nsfwClasses: ['Porn', 'Hentai', 'Sexy'], // Block these classes
      nsfwModelType: 'MobileNetV2', // Lightweight model (~45MB)
      maxImageSize: 1024,          // Max dimension for NSFW input
      
      // Memory management
      gcInterval: 100,             // GC every 100 validations
      tensorCleanup: true,         // Clean up tensors after use
    };
    
    // ═══════════════════════════════════════════════════════
    // STATISTICS TRACKING
    // ═══════════════════════════════════════════════════════
    this.stats = {
      totalValidations: 0,
      withText: 0,
      withoutText: 0,
      decidedByRegex: 0,
      cached: 0,
      blocked: 0,
      allowed: 0,
      avgValidationTime: 0,
      
      // 🆕 NSFW Stats
      nsfwChecks: 0,
      nsfwBlocked: 0,
      nsfwAllowed: 0,
      nsfwSkipped: 0,  // Model not ready yet
      nsfwErrors: 0,
      nsfwAvgTime: 0,
      nsfwModelLoadTime: 0,
    };
    
    // Cache (can be larger on 8GB)
    this.cache = new Map();
    
    // Lock instance
    ImageValidator.#instance = this;
    
    console.log('🖼️  ImageValidator v4.0 initialized');
    console.log('   Mode: NSFW + OCR + Regex (FREE, Local)');
    console.log('   RAM Budget: 8GB - Optimized ✅');
    
    // Start loading NSFW model in background (non-blocking!)
    this._initNSFWModel();
  }

  // ═══════════════════════════════════════════════════════════════
  // 🆕 NSFW MODEL INITIALIZATION
  // ═══════════════════════════════════════════════════════════════
  
  async _initNSFWModel() {
    if (!this.nsfwEnabled || this.nsfwLoading) return;
    
    this.nsfwLoading = true;
    const loadStart = Date.now();
    
    try {
      console.log('');
      console.log('╔══════════════════════════════════════════════════╗');
      console.log('║  🔞 LOADING NSFW MODEL...                      ║');
      console.log('║  First run downloads ~45MB (one-time only)     ║');
      console.log('╚══════════════════════════════════════════════════╝');
      console.log('');

      // Load MobileNetV2 - good balance of speed/accuracy
    this.nsfwModel = await nsfw.load();
// or if you want local model after first download:
// this.nsfwModel = await nsfw.load('https://d2yoq2nk7fjxer.cloudfront.net/mobilenet_v2/');
      
      this.nsfwReady = true;
      this.nsfwLoading = false;
      
      const loadTime = Date.now() - loadStart;
      this.stats.nsfwModelLoadTime = loadTime;
      
      console.log('');
      console.log('╔══════════════════════════════════════════════════╗');
      console.log('║  ✅ NSFW MODEL READY!                           ║');
      console.log(`║  Load Time: ${loadTime}ms                              ║`);
      console.log('║  Classes: Drawing, Hentai, Neutral, Porn, Sexy   ║');
      console.log(`║  Blocking: ${this.config.nsfwClasses.join(', ')}            ║`);
      console.log(`║  Threshold: ${this.config.nsfwThreshold * 100}% confidence                 ║`);
      console.log('╚══════════════════════════════════════════════════╝');
      console.log('');
      
    } catch (error) {
      console.error('');
      console.error('❌ FAILED TO LOAD NSFW MODEL:');
      console.error(error.message);
      console.error('');
      console.error('Possible fixes:');
      console.error('1. Run: npm install @tensorflow/tfjs-node nsfwjs');
      console.error('2. Check internet connection (first download)');
      console.error('3. Ensure sufficient disk space (~100MB)');
      console.error('');
      
      this.nsfwEnabled = false;
      this.nsfwLoading = false;
    }
  }

  // Force wait for model to load (call this on server startup)
  async waitForModel(timeoutMs = 60000) {
    if (this.nsfwReady) return true;
    
    console.log('⏳ Waiting for NSFW model to load...');
    
    const start = Date.now();
    while (!this.nsfwReady && (Date.now() - start) < timeoutMs) {
      await new Promise(r => setTimeout(r, 500));
    }
    
    return this.nsfwReady;
  }

  // ═══════════════════════════════════════════════════════════════
  // 🆕 NSFW DETECTION METHOD
  // ═══════════════════════════════════════════════════════════════
  
  async _checkNSFW(imageBuffer) {
    const startTime = Date.now();
    this.stats.nsfwChecks++;
    
    try {
      // Check if model is ready
      if (!this.nsfwReady || !this.nsfwModel) {
        this.stats.nsfwSkipped++;
        return { 
          blocked: false, 
          reason: 'Model not ready', 
          skipped: true 
        };
      }

      // Pre-process image for NSFW model
      // Resize to reasonable size (don't feed huge images)
      let processedBuffer = imageBuffer;
      
      try {
        processedBuffer = await sharp(imageBuffer)
          .resize(this.config.maxImageSize, this.config.maxImageSize, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 80 })
          .toBuffer();
      } catch (e) {
        // Use original if resize fails
        console.warn('NSFW pre-processing failed, using original:', e.message);
      }

      // Convert to TensorFlow tensor
      const image = await tf.node.decodeImage(processedBuffer, 3);
let predictions;
try {
  predictions = await this.nsfwModel.classify(image);
} finally {
  image.dispose(); // always runs, even on error
}

      // Log predictions (debug)
      const predStr = predictions.map(p => 
        `${p.className}: ${(p.probability * 100).toFixed(1)}%`
      ).join(' | ');
      
      console.log(`   🔞 NSFW → ${predStr}`);

      // Find violations
      const violations = [];
      let maxProb = 0;
      let topViolation = null;

      for (const prediction of predictions) {
        const { className, probability } = prediction;
        
        // Check if this class should be blocked
        if (
          this.config.nsfwClasses.includes(className) && 
          probability >= this.config.nsfwThreshold
        ) {
          violations.push({
            type: 'nsfw',
            class: className,
            probability: probability,
            confidence: Math.round(probability * 100),
            threshold: this.config.nsfwThreshold * 100
          });

          if (probability > maxProb) {
            maxProb = probability;
            topViolation = className;
          }
        }
      }

      const blocked = violations.length > 0;
      const elapsed = Date.now() - startTime;

      // Update stats
      if (blocked) {
        this.stats.nsfwBlocked++;
      } else {
        this.stats.nsfwAllowed++;
      }

      // Rolling average time
      const prevAvg = this.stats.nsfwAvgTime;
      const count = this.stats.nsfwChecks;
      this.stats.nsfwAvgTime = ((prevAvg * (count - 1)) + elapsed) / count;

      return {
        blocked,
        confidence: Math.round(maxProb * 100),
        reason: blocked 
          ? `Inappropriate content detected: ${topViolation}` 
          : 'Content appears appropriate',
        violations,
        allPredictions: predictions.map(p => ({
          className: p.className,
          probability: Math.round(p.probability * 10000) / 100 // Round to 2 decimals
        })),
        checkTime: elapsed,
        skipped: false
      };

    } catch (error) {
      console.error('❌ NSFW check error:', error.message);
      this.stats.nsfwErrors++;
      
      // FAIL OPEN - allow if error (don't block legitimate images)
      return {
        blocked: false,
        reason: 'NSFW check failed - allowing',
        error: error.message,
        skipped: false
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // MAIN VALIDATION METHOD
  // ═══════════════════════════════════════════════════════════════
  
  async validate(imageBuffer, metadata = {}) {
    const startTime = Date.now();
    this.stats.totalValidations++;
    
    // Memory cleanup every N validations
    if (this.stats.totalValidations % this.config.gcInterval === 0) {
      this._cleanupMemory();
    }
    
    try {
      const context = metadata.isProfilePic ? '👤 Profile Pic' : '📷 Content';
      const userId = metadata.userId || 'unknown';
      
      console.log('');
      console.log('┌─────────────────────────────────────────────────┐');
      console.log(`│  🖼️  IMAGE VALIDATION STARTED                   │`);
      console.log(`│  User: ${userId.padEnd(40)}│`);
      console.log(`│  Type: ${context.padEnd(39)}│`);
      console.log('└─────────────────────────────────────────────────┘');

      // ═══════════════════════════════════════════════════════
      // STEP 1: BASIC FILE VALIDATION
      // ═══════════════════════════════════════════════════════
      const basicCheck = this._validateBasics(imageBuffer);
      if (!basicCheck.valid) {
        console.log(`❌ STEP 1 FAILED: ${basicCheck.error}`);
        this.stats.blocked++;
        return this._createResult({
          valid: false, blocked: true, action: 'BLOCK',
          reason: basicCheck.error, confidence: 100,
          checkedBy: ['basic'], scanTime: Date.now() - startTime
        });
      }
      console.log('✅ Step 1: Basic validation passed');

      // ═══════════════════════════════════════════════════════
      // STEP 2: NORMALIZE IMAGE (for consistent hashing)
      // ═══════════════════════════════════════════════════════
      let normalizedBuffer;
      try {
        normalizedBuffer = await sharp(imageBuffer)
          .resize(this.config.normalizeWidth, this.config.normalizeWidth, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: this.config.normalizeQuality })
          .toBuffer();
      } catch (normalizeError) {
        console.warn('⚠️ Normalization failed, using original:', normalizeError.message);
        normalizedBuffer = imageBuffer;
      }
      console.log('✅ Step 2: Image normalized');

      // ═══════════════════════════════════════════════════════
      // STEP 3: HASH & CACHE CHECK
      // ═══════════════════════════════════════════════════════
      const imageHash = this._hashImage(normalizedBuffer);
      
      if (this.config.enableCaching) {
        const cached = this._checkCache(imageHash);
        if (cached) {
          console.log('💾 Step 3: CACHE HIT! Returning cached result');
          this.stats.cached++;
          cached.blocked ? this.stats.blocked++ : this.stats.allowed++;
          return this._createResult({ 
            ...cached, 
            cached: true, 
            scanTime: Date.now() - startTime 
          });
        }
      }
      console.log(`✅ Step 3: Hash: ${imageHash.substring(0, 16)}...`);

      // ═══════════════════════════════════════════════════════
      // 🆕 STEP 4: NSFW / NUDE DETECTION (runs BEFORE OCR)
      // ═══════════════════════════════════════════════════════
      if (this.nsfwEnabled) {
        console.log('🔞 Step 4: Running NSFW detection...');
        
        const nsfwResult = await this._checkNSFW(imageBuffer);
        
        if (nsfwResult.skipped) {
          console.log('⏳ NSFW model not ready yet, skipping...');
        } else if (nsfwResult.blocked) {
          console.log(`🚫 BLOCKED by NSFW! Confidence: ${nsfwResult.confidence}%`);
          console.log(`   Reason: ${nsfwResult.reason}`);
          
          this.stats.blocked++;
          
          const result = this._createResult({
            valid: false,
            blocked: true,
            action: 'BLOCK',
            reason: nsfwResult.reason,
            confidence: nsfwResult.confidence,
            violations: nsfwResult.violations,
            nsfwDetails: nsfwResult.allPredictions,
            checkedBy: ['nsfw'],
            scanTime: Date.now() - startTime
          });
          
          // Cache the block!
          this._saveToCache(imageHash, result);
          
          console.log('└─────────────────────────────────────────────────┘');
          return result;
        } else {
          console.log(`✅ Step 4: NSFW passed (${nsfwResult.checkTime}ms)`);
        }
      }

      // ═══════════════════════════════════════════════════════
      // STEP 5: OCR TEXT EXTRACTION (WITH QUALITY CHECKS)
      // ═══════════════════════════════════════════════════════
      console.log('📝 Step 5: Extracting text with OCR...');
      const ocrResult = await this.ocr.extractText(imageBuffer);
      
      // 🆕 Get OCR confidence
      const ocrConfidence = ocrResult.confidence || 0;
      const minOcrConfidence = this.config.minOcrConfidence;
      console.log(`   📊 OCR Confidence: ${ocrConfidence}%`);
      
      if (!ocrResult.text || ocrResult.text.length < this.config.minTextLength) {
        console.log('✅ No significant text detected - ALLOWED');
        this.stats.withoutText++;
        this.stats.allowed++;
        
        const result = this._createResult({
          valid: true, blocked: false, action: 'ALLOW',
          reason: 'No significant text detected', confidence: 0,
          ocrResult, checkedBy: ['nsfw', 'ocr'], scanTime: Date.now() - startTime
        });
        
        this._saveToCache(imageHash, result);
        console.log('└─────────────────────────────────────────────────┘');
        return result;
      }
      
      // 🆕 NEW CHECK: Skip regex if OCR confidence is too low (garbage text)
      if (ocrConfidence < minOcrConfidence) {
        console.log(`⚠️ OCR confidence too low (${ocrConfidence}% < ${minOcrConfidence}%)`);
        console.log('✅ Skipping regex - likely garbage/artifact text - ALLOWED');
        
        this.stats.withoutText++;
        this.stats.allowed++;
        
        const result = this._createResult({
          valid: true, blocked: false, action: 'ALLOW',
          reason: `Low OCR confidence (${ocrConfidence}%), text not reliable`, 
          confidence: 0,
          ocrResult, 
          checkedBy: ['nsfw', 'ocr-low-confidence'], 
          scanTime: Date.now() - startTime
        });
        
        this._saveToCache(imageHash, result);
        console.log('└─────────────────────────────────────────────────┘');
        return result;
      }
      
      // 🆕 NEW CHECK: Validate text quality (not random garbage)
      const textQuality = this._validateOcrTextQuality(ocrResult.text);
      if (!textQuality.valid) {
        console.log(`⚠️ Poor OCR quality: ${textQuality.reason}`);
        console.log('✅ Allowing image - OCR text appears to be artifacts/noise');
        
        this.stats.allowed++;
        const result = this._createResult({
          valid: true, blocked: false, action: 'ALLOW',
          reason: `OCR text quality issue: ${textQuality.reason}`,
          confidence: 0,
          ocrResult,
          checkedBy: ['nsfw', 'ocr-quality-filter'],
          scanTime: Date.now() - startTime
        });
        
        this._saveToCache(imageHash, result);
        console.log('└─────────────────────────────────────────────────┘');
        return result;
      }
      
      this.stats.withText++;
      console.log(`📄 Text found: ${ocrResult.characterCount} chars (confidence: ${ocrConfidence}%)`);

      // ═══════════════════════════════════════════════════════
      // STEP 6: DUAL REGEX CHECK (Chat + Strict)
      // ═══════════════════════════════════════════════════════
      console.log('🔍 Step 6: Running dual-regex checks...');
      
      // Pass 1: Fast Chat Regex
      const chatRegexResult = ChatRegexPatterns.validateChatMessage(
        ocrResult.text, 
        'image_ocr'
      );
      
      let finalResult = chatRegexResult.blocked 
        ? { 
            blocked: true, 
            confidence: 100, 
            violations: [{ type: 'chat_regex', reason: chatRegexResult.reason }] 
          }
        : null;

      // Pass 2: Strict Regex (only if Pass 1 didn't catch it)
      if (!finalResult?.blocked) {
        const strictRegexResult = this.patterns.checkAll(ocrResult.text);
        if (strictRegexResult.confidence >= this.config.regexBlockThreshold) {
          finalResult = { 
            blocked: true, 
            confidence: strictRegexResult.confidence, 
            violations: strictRegexResult.violations 
          };
        }
      }

      const blocked = finalResult?.blocked || false;
      this.stats.decidedByRegex++;

      if (blocked) {
        console.log(`🚫 BLOCKED by Regex! Confidence: ${finalResult.confidence}%`);
        this.stats.blocked++;
      } else {
        console.log('✅ Regex passed - ALLOWED');
        this.stats.allowed++;
      }

      const result = this._createResult({
        valid: !blocked,
        blocked,
        action: blocked ? 'BLOCK' : 'ALLOW',
        reason: blocked 
          ? 'Contact information detected in image' 
          : 'No violations detected',
        confidence: finalResult?.confidence || 0,
        ocrResult,
        regexResult: finalResult,
        violations: finalResult?.violations || [],
        checkedBy: ['nsfw', 'ocr', 'dual-regex'],
        scanTime: Date.now() - startTime
      });

      this._saveToCache(imageHash, result);
      this._updateAvgTime(Date.now() - startTime);

      console.log('└─────────────────────────────────────────────────┘');
      return result;

    } catch (error) {
      console.error('❌ VALIDATION ERROR:', error);
      this.stats.allowed++;
      
      return this._createResult({
        valid: true, blocked: false, action: 'ALLOW',
        reason: 'Validation error - allowing (logged)', confidence: 0,
        error: error.message, needsManualReview: true,
        scanTime: Date.now() - startTime
      });
    }
  }




    // ═══════════════════════════════════════════════════════════════
  // 🆕 OCR TEXT QUALITY VALIDATION
  // ═══════════════════════════════════════════════════════════════
  
  _validateOcrTextQuality(text) {
    if (!text || text.length === 0) return { valid: false, reason: 'Empty text' };
    
    const totalChars = text.length;
    
    // Count actual alphanumeric content (not symbols/spaces/newlines)
    const alphaNumeric = (text.match(/[a-zA-Z0-9]/g) || []).length;
    const alphaRatio = alphaNumeric / totalChars;
    
    // If less than 30% alphanumeric, it's probably garbage/noise
    if (alphaRatio < 0.3) {
      return { 
        valid: false, 
        reason: `Low alphanumeric ratio (${(alphaRatio * 100).toFixed(1)}%)`,
        alphaRatio 
      };
    }
    
    // Check for repeated characters like "aaaaaa" or "000000" (artifact pattern)
    const repeatedPattern = /(.)\1{6,}/.test(text.replace(/\s/g, ''));
    if (repeatedPattern) {
      return { 
        valid: false, 
        reason: 'Repeated character pattern detected (likely artifact)' 
      };
    }
    
    // Check for excessive special characters
    const specialChars = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
    const specialRatio = specialChars / totalChars;
    
    if (specialRatio > 0.65) {
      return { 
        valid: false, 
        reason: `High special character ratio (${(specialRatio * 100).toFixed(1)}%)` 
      };
    }
    
    return { 
      valid: true, 
      alphaRatio,
      specialRatio
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // ═══════════════════════════════════════════════════════════════
  // PRIVATE HELPERS
  // ═══════════════════════════════════════════════════════════════

  _validateBasics(imageBuffer) {
    if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
      return { valid: false, error: 'Invalid image buffer' };
    }
    if (imageBuffer.length < 100) {
      return { valid: false, error: 'Image file too small (< 100 bytes)' };
    }
    if (imageBuffer.length > 10 * 1024 * 1024) {
      return { valid: false, error: 'Image exceeds 10MB limit' };
    }
    
    const format = this._detectFormat(imageBuffer);
    const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    
    if (!allowedFormats.includes(format)) {
      return { valid: false, error: `Unsupported format: ${format}` };
    }
    
    return { valid: true };
  }

  _detectFormat(buffer) {
    const signatures = {
      'ffd8ff': 'jpg',
      '89504e47': 'png',
      '52494646': 'webp',
      '47494638': 'gif'
    };
    
    const header = buffer.toString('hex', 0, 4);
    
    for (const [signature, format] of Object.entries(signatures)) {
      if (header.startsWith(signature)) {
        return format;
      }
    }
    
    return 'unknown';
  }

  _hashImage(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  _checkCache(hash) {
    if (!this.cache.has(hash)) return null;
    
    const entry = this.cache.get(hash);
    const age = Date.now() - entry.timestamp;
    
    if (age > this.config.cacheExpiry) {
      this.cache.delete(hash);
      return null;
    }
    
    return entry.result;
  }

  _saveToCache(hash, result) {
    // Optional: Don't cache blocked results (uncomment next line if desired)
    // if (result.blocked) return;
    
    // Evict oldest entry if cache is full
    if (this.cache.size >= this.config.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    // Store minimal data to save memory
    this.cache.set(hash, {
      result: {
        valid: result.valid,
        blocked: result.blocked,
        action: result.action,
        reason: result.reason,
        confidence: result.confidence
      },
      timestamp: Date.now()
    });
  }

  _createResult(data) {
    return {
      valid: data.valid,
      blocked: data.blocked,
      action: data.action,
      reason: data.reason,
      confidence: data.confidence || 0,
      ocrResult: data.ocrResult || null,
      regexResult: data.regexResult || null,
      violations: data.violations || [],
      nsfwDetails: data.nsfwDetails || null,
      checkedBy: data.checkedBy || [],
      scanTime: data.scanTime || 0,
      cached: data.cached || false,
      error: data.error || null,
      needsManualReview: data.needsManualReview || false,
      validator: 'ImageValidator',
      version: '4.0.0-NSFW-Production',
      timestamp: new Date().toISOString()
    };
  }

  _updateAvgTime(time) {
    const prev = this.stats.avgValidationTime;
    const count = this.stats.totalValidations;
    this.stats.avgValidationTime = ((prev * (count - 1)) + time) / count;
  }

  // 🆕 Memory cleanup helper
  _cleanupMemory() {
    console.log('🗑️ Running periodic cleanup...');
    
    // Clear expired cache entries
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.config.cacheExpiry) {
        this.cache.delete(key);
      }
    }
    
    // Trigger garbage collection if available
    if (global.gc) {
      global.gc();
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // PUBLIC API METHODS
  // ═══════════════════════════════════════════════════════════════

  getStats() {
    return {
      ...this.stats,
      mode: 'NSFW_OCR_REGEX',
      cost: '$0.00 (FREE)',
      blockRate: (
        (this.stats.blocked / (this.stats.totalValidations || 1)) * 100
      ).toFixed(1) + '%',
      
      // NSFW specific stats
      nsfwStatus: this.nsfwReady ? '✅ Ready' : '⏳ Loading...',
      nsfwEnabled: this.nsfwEnabled,
      nsfwModelLoaded: this.nsfwReady,
      cacheSize: this.cache.size,
      
      // Performance
      avgNsfwTime: `${this.stats.nsfwAvgTime.toFixed(0)}ms`,
      avgTotalTime: `${this.stats.avgValidationTime.toFixed(0)}ms`
    };
  }

  getHealth() {
    return {
      status: 'healthy',
      validator: 'ImageValidator',
      version: '4.0.0-NSFW',
      ready: true,
      ocrReady: this.ocr?.getHealth()?.ready ?? false,
      nsfwReady: this.nsfwReady,
      mode: 'FREE_LOCAL_NSFW',
      config: {
        nsfwThreshold: this.config.nsfwThreshold,
        nsfwClasses: this.config.nsfwClasses,
        cacheEnabled: this.config.enableCaching,
        cacheSize: this.cache.size
      },
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    };
  }

  // Manual cache clear
  clearCache() {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`🗑️ Cache cleared (${size} entries removed)`);
    return size;
  }

  // Preload model before accepting requests
  async preload() {
    console.log('🔄 Preloading NSFW model...');
    return await this.waitForModel(120000); // 2 minute timeout
  }

  async shutdown() {
    console.log('');
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║  🛑 SHUTTING DOWN IMAGE VALIDATOR              ║');
    console.log('╚══════════════════════════════════════════════════╝');
    
    await this.ocr?.shutdown();
    this.cache.clear();
    
    // Cleanup TF
    if (tf) {
      try {
        // End backend session
        // Note: In some versions this might not exist
        // It's okay if it fails
      } catch (e) {}
    }
    
    ImageValidator.#instance = null;
    console.log('✅ ImageValidator shutdown complete');
  }
}

export default ImageValidator;