// Services/Chat/linkDetectionService.js

/**
 * ═══════════════════════════════════════════════════════════════
 *                    🔗 LINK DETECTION SERVICE
 *         Detects and validates URLs in chat messages
 * ═══════════════════════════════════════════════════════════════
 * 
 * Features:
 * - Detects all types of URLs (http, www, domain.com)
 * - Blocks social media and messaging app links
 * - Allows cloud storage links (with warning)
 * - Warns about unknown links
 * 
 * ═══════════════════════════════════════════════════════════════
 */

class LinkDetectionService {
  
  constructor() {
    console.log('🔗 LinkDetectionService initialized');
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ ALLOWED CLOUD STORAGE DOMAINS
  // ═══════════════════════════════════════════════════════════════
  
  ALLOWED_DOMAINS = [
    // Google Services
    'drive.google.com',
    'docs.google.com',
    'sheets.google.com',
    'slides.google.com',
    'forms.google.com',
    
    // Dropbox
    'dropbox.com',
    'www.dropbox.com',
    'db.tt', // Dropbox short links
    
    // Microsoft OneDrive
    'onedrive.live.com',
    '1drv.ms',
    'sharepoint.com',
    
    // Box
    'box.com',
    'app.box.com',
    
    // iCloud
    'icloud.com',
    'www.icloud.com',
    
    // Other cloud storage
    'mega.nz',
    'mega.io',
    'wetransfer.com',
    'we.tl', // WeTransfer short links
    'mediafire.com',
    'www.mediafire.com',
    
    // Cloud platforms (for project files)
    'amazonaws.com', // AWS S3
    's3.amazonaws.com',
    'cloudflare.com', // R2
    'r2.cloudflarestorage.com',
    'storage.googleapis.com', // Google Cloud Storage
    'blob.core.windows.net', // Azure Storage
    'digitaloceanspaces.com', // DigitalOcean Spaces

    // ════════════════════════════════════════
  // 💰 PAYMENT LINKS (ALLOWED)
  // ════════════════════════════════════════
  'rzp.io',              // Razorpay payment links ← your own
  'pay.google.com',      // GPay
  'phonepe.com',         // PhonePe
  'paytm.com',           // Paytm
  'bhimupi.org.in',      // BHIM
  'amazonpay.in',        // Amazon Pay
  'mobikwik.com',        // Mobikwik
  'freecharge.in',       // Freecharge
  'cred.club',           // Cred
  'payu.in',             // PayU
  'paytm.in',            // Paytm
  'mobiikwik.com',       // Mobikwik
  'freecharge.co.in',    // Freecharge
  'cred.club',           // Cred
  'payu.in',             // PayU
    
    // File transfer services
    'send.firefox.com',
    'filemail.com',
    'hightail.com'
  ];

  // ═══════════════════════════════════════════════════════════════
  // 🚫 BLOCKED DOMAINS (Social media, messaging apps, etc.)
  // ═══════════════════════════════════════════════════════════════
  
  BLOCKED_DOMAINS = [
    // ════════════════════════════════════════
    // MESSAGING APPS (Highest Priority Block)
    // ════════════════════════════════════════
    'whatsapp.com',
    'web.whatsapp.com',
    'wa.me',
    'chat.whatsapp.com',
    'api.whatsapp.com',
    
    'telegram.org',
    'telegram.me',
    't.me',
    'web.telegram.org',
    
    'discord.gg',
    'discord.com',
    'discordapp.com',
    
    'skype.com',
    'join.skype.com',
    
    'zoom.us',
    'zoom.com',
    
    'meet.google.com',
    'hangouts.google.com',
    
    'teams.microsoft.com',
    'teams.live.com',
    
    'slack.com',
    
    'viber.com',
    
    'wechat.com',
    'weixin.qq.com',
    
    'line.me',
    
    'signal.org',
    
    // ════════════════════════════════════════
    // SOCIAL MEDIA PLATFORMS
    // ════════════════════════════════════════
    'facebook.com',
    'fb.com',
    'fb.me',
    'www.facebook.com',
    'm.facebook.com',
    
    'messenger.com',
    'm.me',
    
    'instagram.com',
    'instagr.am',
    'www.instagram.com',
    
    'twitter.com',
    'x.com',
    't.co',
    'www.twitter.com',
    
    'snapchat.com',
    
    'tiktok.com',
    'www.tiktok.com',
    
    'linkedin.com',
    'lnkd.in',
    'www.linkedin.com',
    
    'reddit.com',
    'www.reddit.com',
    'redd.it',
    
    'pinterest.com',
    'pin.it',
    
    'tumblr.com',
    
    'vk.com',
    
    'myspace.com',
    
    // ════════════════════════════════════════
    // DATING & HOOKUP SITES
    // ════════════════════════════════════════
    'tinder.com',
    'bumble.com',
    'match.com',
    'okcupid.com',
    'pof.com',
    'hinge.co',
    'badoo.com',
    'meetme.com',
    'zoosk.com',
    'eharmony.com',
    
    // ════════════════════════════════════════
    // URL SHORTENERS (Can hide malicious links)
    // ════════════════════════════════════════
    'bit.ly',
    'bitly.com',
    'tinyurl.com',
    'goo.gl',
    'ow.ly',
    'short.io',
    'rebrandly.com',
    'tiny.cc',
    'is.gd',
    'buff.ly',
    
    // ════════════════════════════════════════
    // VIDEO CALL PLATFORMS
    // ════════════════════════════════════════
    'whereby.com',
    'jitsi.org',
    'meet.jit.si',
    'goto.com',
    'gotomeeting.com',
    'webex.com',
    'bluejeans.com',
    
    // ════════════════════════════════════════
    // ADULT/INAPPROPRIATE CONTENT
    // ════════════════════════════════════════
    'onlyfans.com',
    'fansly.com',
    'patreon.com', // Can be used inappropriately
    
    // ════════════════════════════════════════
    // CRYPTOCURRENCY/SCAM RELATED
    // ════════════════════════════════════════
    'blockchain.com',
    'coinbase.com',
    'binance.com',
    'crypto.com'
  ];

  // ═══════════════════════════════════════════════════════════════
  // 🔍 DETECT LINKS IN TEXT
  // ═══════════════════════════════════════════════════════════════
  
  detectLinks(text) {


    if (!text || typeof text !== 'string') {
      return [];
    }

    // Enhanced URL regex that catches:
    // - http://example.com
    // - https://example.com
    // - www.example.com
    // - example.com
    // - subdomain.example.com
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}[^\s]*)/gi;
    
    const matches = text.match(urlRegex) || [];

    const detectedLinks = [];

    for (const url of matches) {
      // Skip if it looks like an email


     // This already handles rudra@ybl correctly — skips it as a link ✅
if (url.includes('@') && !url.includes('://')) {
  continue;
}

      // Normalize URL
      let normalizedUrl = url.trim();
      
      // Remove trailing punctuation (. , ! ? etc.)
      normalizedUrl = normalizedUrl.replace(/[.,!?;:]+$/, '');
      
      if (!normalizedUrl.startsWith('http')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }

      try {
        const urlObj = new URL(normalizedUrl);
        
        detectedLinks.push({
          original: url,
          normalized: normalizedUrl,
          domain: urlObj.hostname.replace(/^www\./, '').toLowerCase(),
          fullDomain: urlObj.hostname.toLowerCase(),
          protocol: urlObj.protocol,
          path: urlObj.pathname,
          hash: urlObj.hash,
          search: urlObj.search
        });
        
      } catch (error) {
        // If URL parsing fails, try to extract domain manually
        const domainMatch = normalizedUrl.match(/(?:https?:\/\/)?(?:www\.)?([^\/\s]+)/i);
        
        if (domainMatch && domainMatch[1]) {
          detectedLinks.push({
            original: url,
            normalized: normalizedUrl,
            domain: domainMatch[1].toLowerCase(),
            fullDomain: domainMatch[1].toLowerCase(),
            protocol: 'unknown',
            path: '',
            hash: '',
            search: '',
            parseError: true
          });
        }
      }
    }

    return detectedLinks;
  }

  // ═══════════════════════════════════════════════════════════════
  // 🔍 CHECK IF DOMAIN IS BLOCKED
  // ═══════════════════════════════════════════════════════════════
  
// ═══════════════════════════════════════════════════════════════
// 🔍 CHECK IF DOMAIN IS BLOCKED (FIXED VERSION)
// ═══════════════════════════════════════════════════════════════

isBlocked(domain) {
  const normalizedDomain = domain.toLowerCase().replace(/^www\./, '');
  
  return this.BLOCKED_DOMAINS.some(blocked => {
    const normalizedBlocked = blocked.toLowerCase().replace(/^www\./, '');
    
    // ✅ 1. Exact match (e.g., "discord.com" === "discord.com")
    if (normalizedDomain === normalizedBlocked) {
      console.log(`🚫 [BLOCK] Exact match: ${normalizedDomain}`);
      return true;
    }
    
    // ✅ 2. Subdomain match (e.g., "chat.whatsapp.com" ends with "whatsapp.com")
    if (normalizedDomain.endsWith('.' + normalizedBlocked)) {
      console.log(`🚫 [BLOCK] Subdomain match: ${normalizedDomain} ends with .${normalizedBlocked}`);
      return true;
    }
    
    // ❌ REMOVED: .includes() - This was causing false positives!
    // "dropbox.com".includes("box.com") was returning TRUE ❌
    
    return false;
  });
}

// ═══════════════════════════════════════════════════════════════
// ✅ CHECK IF DOMAIN IS ALLOWED (FIXED VERSION)
// ═══════════════════════════════════════════════════════════════

isAllowed(domain) {
  const normalizedDomain = domain.toLowerCase().replace(/^www\./, '');
  
  return this.ALLOWED_DOMAINS.some(allowed => {
    const normalizedAllowed = allowed.toLowerCase().replace(/^www\./, '');
    
    // ✅ 1. Exact match
    if (normalizedDomain === normalizedAllowed) {
      console.log(`✅ [ALLOW] Exact match: ${normalizedDomain}`);
      return true;
    }
    
    // ✅ 2. Subdomain match (e.g., "docs.google.com" ends with "google.com")
    if (normalizedDomain.endsWith('.' + normalizedAllowed)) {
      console.log(`✅ [ALLOW] Subdomain match: ${normalizedDomain} ends with .${normalizedAllowed}`);
      return true;
    }
    
    // ❌ REMOVED: .includes() to prevent false positives
    
    return false;
  });
}

  // ═══════════════════════════════════════════════════════════════
  // ✅ VALIDATE MESSAGE WITH LINKS
  // ═══════════════════════════════════════════════════════════════
  
  validateMessage(text) {
    const links = this.detectLinks(text);

    // No links found - allow immediately
    if (links.length === 0) {
      return {
        allowed: true,
        hasLinks: false,
        warning: null,
        blockedLinks: [],
        allowedLinks: [],
        unknownLinks: [],
        totalLinks: 0
      };
    }

    const allowedLinks = [];
    const blockedLinks = [];
    const unknownLinks = [];

    // Categorize each link
    for (const link of links) {
      const domain = link.domain;

      // Check if blocked (highest priority)
      if (this.isBlocked(domain)) {
        blockedLinks.push({
          ...link,
          reason: 'Social media or external messaging platform'
        });
        continue;
      }

      // Check if allowed (cloud storage)
      if (this.isAllowed(domain)) {
        allowedLinks.push({
          ...link,
          type: 'cloud_storage'
        });
        continue;
      }

      // Unknown domain
      unknownLinks.push({
        ...link,
        type: 'unknown'
      });
    }

    // ════════════════════════════════════════════════════════════
    // DECISION LOGIC
    // ════════════════════════════════════════════════════════════

    // ❌ BLOCK if ANY blocked domain found
    if (blockedLinks.length > 0) {
      return {
        allowed: false,
        hasLinks: true,
        blocked: true,
        reason: '🚫 Social media and external chat platform links are not allowed',
        warning: '⚠️ **Stay on platform for your security.** External communication links are blocked to protect users from scams and fraud.',
        blockedLinks,
        allowedLinks,
        unknownLinks,
        totalLinks: links.length,
        blockedCount: blockedLinks.length
      };
    }

    // ⚠️ WARN for unknown links (but allow)
    if (unknownLinks.length > 0) {
      return {
        allowed: true,
        hasLinks: true,
        warning: '⚠️ **Be in Platform for your Security reason.** We recommend using trusted cloud storage services (Google Drive, Dropbox, etc.) for file sharing.',
        blockedLinks,
        allowedLinks,
        unknownLinks,
        totalLinks: links.length,
        unknownCount: unknownLinks.length
      };
    }

// ✅ ALLOW cloud storage + payment links (but still warn)
    if (allowedLinks.length > 0) {

      const paymentDomains = ['rzp.io', 'phonepe.com', 'paytm.com', 'pay.google.com', 'amazonpay.in'];
      const hasPaymentLinks = allowedLinks.some(l =>
        paymentDomains.some(d => l.domain.includes(d))
      );

      return {
        allowed: true,
        hasLinks: true,
        warning: hasPaymentLinks
          ? '💰 Payment link detected. Only pay through trusted UPI apps.'
          : '⚠️ **Be in Platform for your Security reason.** Cloud storage link detected. Always verify the sender before accessing shared files.',
        blockedLinks,
        allowedLinks,
        unknownLinks,
        totalLinks: links.length,
        allowedCount: allowedLinks.length
      };
    }

    // Fallback (shouldn't reach here)
    return {
      allowed: true,
      hasLinks: true,
      warning: '⚠️ **Be in Platform for your Security reason.**',
      blockedLinks,
      allowedLinks,
      unknownLinks,
      totalLinks: links.length
    };
  }
  
  // ═══════════════════════════════════════════════════════════════
  // 📊 GET STATISTICS
  // ═══════════════════════════════════════════════════════════════
  
  getStats() {
    return {
      allowedDomains: this.ALLOWED_DOMAINS.length,
      blockedDomains: this.BLOCKED_DOMAINS.length,
      categories: {
        messaging: this.BLOCKED_DOMAINS.filter(d => 
          d.includes('whatsapp') || d.includes('telegram') || 
          d.includes('discord') || d.includes('skype')
        ).length,
        socialMedia: this.BLOCKED_DOMAINS.filter(d => 
          d.includes('facebook') || d.includes('instagram') || 
          d.includes('twitter') || d.includes('tiktok')
        ).length,
        cloudStorage: this.ALLOWED_DOMAINS.length
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // 🏥 HEALTH CHECK
  // ═══════════════════════════════════════════════════════════════
  
  getHealth() {
    return {
      status: 'healthy',
      ready: true,
      service: 'LinkDetectionService',
      version: '1.0.0',
      allowedDomains: this.ALLOWED_DOMAINS.length,
      blockedDomains: this.BLOCKED_DOMAINS.length
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════

export default new LinkDetectionService();