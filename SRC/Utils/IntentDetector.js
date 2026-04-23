// ═══════════════════════════════════════════════════════════════
// 🧩 IMPORT ALL PLUGINS DIRECTLY HERE
// ═══════════════════════════════════════════════════════════════
import blockToxicSlang from './chat-plugins/blockToxicSlang.js';
import blockHinglishActions from './chat-plugins/blockHinglishActions.js';
import blockPlatformTypos from './chat-plugins/blockPlatformTypos.js';
import blockDirectContactRequests from './chat-plugins/blockDirectContactRequests.js';
import blockFinancialEscapes from './chat-plugins/blockFinancialEscapes.js';
import blockOffPlatformInstructions from './chat-plugins/blockOffPlatformInstructions.js';
import blockSocialMediaActions from './chat-plugins/blockSocialMediaActions.js';

const PLUGINS = [
  blockToxicSlang,                // 1. Always check abuse first
  blockHinglishActions,           // 2. Hinglish action demands
  blockPlatformTypos,             // 3. App name obfuscation
  blockDirectContactRequests,     // 4. Direct data extraction
  blockFinancialEscapes,          // 5. Payment bypasses
  blockOffPlatformInstructions,   // 6. "Talk outside" requests
  blockSocialMediaActions         // 7. Social handle sharing
];

/**
 * ════════════════════════════════════════════════════════════════
 * 🧠 ULTRA-FAST INTENT DETECTOR & CONTEXT ENGINE
 * ════════════════════════════════════════════════════════════════
 */
export default class IntentDetector {
  
  constructor() {
    console.log('🧠 IntentDetector initialized (Production Mode)');
    console.log(`   🧩 Absorbed ${PLUGINS.length} security plugins`);
    
    this.userContext = new Map();
    setInterval(() => this.userContext.clear(), 5 * 60 * 1000);
  }

  analyzeIntent(normalizedText, rawText, userId = 'anonymous') {
    if (!normalizedText || normalizedText.length < 2) return null;

    const stitchedText = this._stitchContext(userId, normalizedText);
    const nlpData = this._analyzeGrammar(rawText);
    const intent = this._resolveIntent(stitchedText, nlpData);

    // ✅ Early exit for 100% safe messages (Skip ALL plugins)
    if (intent === 'INNOCENT_PROJECT_CONTEXT') {
      return null; 
    }

    // ✅ Run ALL plugins with 50ms Timeout Guard protection
    for (const plugin of PLUGINS) {
      try {
        plugin.pattern.lastIndex = 0;
        const startTime = Date.now();
        const isBlocked = plugin.pattern.test(stitchedText);
        
        // If any regex takes more than 50ms, skip it to prevent lag
        if (Date.now() - startTime > 50) {
          console.warn(`   ⚠️ SLOW PLUGIN DETECTED: ${plugin.type} (took ${Date.now() - startTime}ms) - SKIPPED`);
          continue; 
        }
        
        if (isBlocked) {
          console.log(`   🧩 [Intent: ${intent}] Plugin triggered: ${plugin.type}`);
          return { blocked: true, reason: plugin.reason, type: plugin.type };
        }
      } catch (err) {
        console.error(`   ⚠️ Plugin error on ${plugin.type}:`, err.message);
      }
    }

    return null; 
  }
  // ═══════════════════════════════════════════════════════════
  // 🔧 GRAMMAR EXTRACTOR
  // ═══════════════════════════════════════════════════════════
  _analyzeGrammar(text) {
    const lowerText = text.toLowerCase();
    
    // Extract verbs and nouns into lightweight arrays
    const verbs = lowerText.match(/\b(?:call|msg|dm|ping|text|share|give|send|drop|take|have|get|save|write|discuss|talk|pay|transfer|do|karo|dedo|bhejo|lena|dikha)\b/gi) || [];
    const nouns = lowerText.match(/\b(?:number|contact|email|id|project|work|task|payment|order|design|file|document|whatsapp|insta|telegram|call|phone|details|info)\b/gi) || [];
    
    const hasNegative = /\b(?:no|not|don't|dont|do not|never|without|avoid|mat|nahi|nahin)\b/gi.test(lowerText);
    const isQuestion = /\?$/.test(lowerText) || /^(what|how|where|when|kya|kaise|konsa)/i.test(lowerText);
    
    return { verbs, nouns, hasNegative, isQuestion };
  }

  // ═══════════════════════════════════════════════════════════
  // 🎯 INTENT RESOLVER
  // ═══════════════════════════════════════════════════════════
  _resolveIntent(text, nlpData) {
    const { verbs, nouns, hasNegative, isQuestion } = nlpData;
    
    // Fast checks using Sets
    const SAFE_TOPICS = new Set(['project', 'work', 'task', 'payment', 'order', 'design', 'file', 'document', 'delivery', 'requirement', 'price', 'cost', 'proposal', 'contract', 'invoice']);
    const SAFE_ACTIONS = new Set(['discuss', 'talk', 'send', 'show', 'check', 'review', 'update', 'confirm', 'start', 'finish', 'create', 'make', 'build']);
    const MALICIOUS_VERBS = new Set(['call', 'dm', 'ping', 'text', 'ring', 'dial', 'vc']);
    const MALICIOUS_NOUNS = new Set(['number', ,'number','num', 'mobile', 'phone', 'contact', 'details', 'info', 'whatsapp', 'insta', 'telegram', 'personal', 'dm', 'dm karo', 'direct']);

    const hasSafeTopic = nouns.some(n => SAFE_TOPICS.has(n));
    const hasSafeAction = verbs.some(v => SAFE_ACTIONS.has(v));
    const hasMaliciousVerb = verbs.some(v => MALICIOUS_VERBS.has(v));
    const hasMaliciousNoun = nouns.some(n => MALICIOUS_NOUNS.has(n));

    // 🚨 TIER 1: CONTEXT BYPASS TRAPS
    if (/\b(?:no\s*no|not\s*now|nahi\s*abhi|leave\s*it|forget\s*it)[\s\S]{0,30}?(?:call|number|contact|dm|personal)\b/gi.test(text)) {
      return 'CONTEXT_BYPASS';
    }

    // 🛡️ TIER 2: INNOCENT PROJECT CONTEXT (Strict)
    // Must have BOTH a safe noun AND a safe action verb to bypass
    if (hasSafeTopic && hasSafeAction && !hasMaliciousNoun) {
      return 'INNOCENT_PROJECT_CONTEXT';
    }
    if (hasNegative && hasSafeTopic && !hasMaliciousNoun) {
      return 'INNOCENT_PROJECT_CONTEXT';
    }

    // 🚀 TIER 3: AGGRESSIVE DIRECT DEMANDS
    if (!hasNegative) {
      // "call me", "send me your number"
      if (hasMaliciousVerb) return 'DEMAND_CONTACT';
      
      // "send your number" (Allows "check the file number" because hasSafeTopic is true)
      if (hasMaliciousNoun && !hasSafeTopic) return 'DEMAND_CONTACT';
    }

    // 🇮🇳 TIER 4: HINGLISH ACTION DEMANDS
    if (/\b(?:karo|kro|do|dedo|bhejo|lena|dikha|bata|daalo)\b/gi.test(text)) {
      return 'HINGLISH_DEMAND';
    }

    // ❓ TIER 5: QUESTIONING FOR DATA
    if (isQuestion && hasMaliciousNoun) {
      return 'QUESTION_FISHING';
    }

    // ✅ TIER 6: FALLBACK SAFE CHECK
    if (hasSafeTopic && !hasMaliciousNoun) {
      return 'INNOCENT_PROJECT_CONTEXT';
    }

    return 'UNKNOWN';
  }

  // ═══════════════════════════════════════════════════════════
  // 🧩 CROSS-MESSAGE STATE MEMORY
  // ═══════════════════════════════════════════════════════════
  _stitchContext(userId, text) {
    const context = this.userContext.get(userId) || { pendingNegative: null };
    if (context.pendingNegative) {
      const stitched = `${context.pendingNegative} ${text}`;
      context.pendingNegative = null; 
      this.userContext.set(userId, context);
      return stitched;
    }
    if (/^(?:no\s*no|not\s*now|nahi\s*abhi|leave\s*it|forget\s*it|nahi\s*yaar|no\s+thanks)/gi.test(text.trim())) {
      context.pendingNegative = text.trim();
      this.userContext.set(userId, context);
    }
    return text;
  }
}