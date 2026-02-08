# Custom Domain Setup Guide
## Connect pushpakoirala.com.np to Your Portfolio

Based on your DNS provider interface (which looks like a cPanel/Hosting control panel), here's how to set up your custom domain:

---

## 📋 **What You Need**

Your Emergent deployment URL: `https://dev-portfolio-hub-51.preview.emergentagent.com`

Target domain: `pushpakoirala.com.np`

---

## 🔧 **DNS Configuration Steps**

### Option 1: Using CNAME (Recommended for Subdomains)

If you want to use `www.pushpakoirala.com.np` or any subdomain:

1. **Go to DNS Management** in your hosting panel
2. **Add a CNAME Record:**
   - **Type:** CNAME
   - **Name/Host:** `www` (or `@` for root)
   - **Value/Points to:** `dev-portfolio-hub-51.preview.emergentagent.com`
   - **TTL:** 3600 (or leave default)

### Option 2: Using A Record (For Root Domain)

If you want to use just `pushpakoirala.com.np` (no www):

1. **Get the IP address** of your Emergent deployment:
   ```bash
   nslookup dev-portfolio-hub-51.preview.emergentagent.com
   # or
   dig dev-portfolio-hub-51.preview.emergentagent.com
   ```

2. **Add an A Record:**
   - **Type:** A
   - **Name/Host:** `@` (represents root domain)
   - **Value/IP Address:** [IP from step 1]
   - **TTL:** 3600

### Option 3: Both WWW and Non-WWW (Recommended)

Set up both for best coverage:

**Record 1 (Root domain):**
- Type: A
- Host: `@`
- Value: [Emergent IP]
- TTL: 3600

**Record 2 (WWW subdomain):**
- Type: CNAME
- Host: `www`
- Value: `pushpakoirala.com.np` (or the A record)
- TTL: 3600

---

## 🎯 **Exact Steps for Your DNS Panel**

Based on your screenshot:

1. **Click on "DNS Management"** or "Zone Editor" (look for DNS/Domain settings)

2. **Find "Add Record" or "Add DNS Record"** button

3. **Fill in the form:**
   ```
   Type: CNAME
   Name: www
   Target: dev-portfolio-hub-51.preview.emergentagent.com
   TTL: 3600
   ```

4. **Add another record for root domain:**
   ```
   Type: A
   Name: @
   Target: [IP address of your deployment]
   TTL: 3600
   ```

5. **Click Save/Submit**

---

## ⚙️ **Configure Custom Domain in Emergent**

After DNS is configured, you need to tell Emergent about your custom domain:

### Method 1: Through Emergent Dashboard
1. Go to your Emergent project dashboard
2. Navigate to **Settings** → **Domains**
3. Click **Add Custom Domain**
4. Enter: `pushpakoirala.com.np`
5. Follow the verification steps

### Method 2: Contact Support
If you don't see domain settings, reach out to Emergent support with:
- Your domain: `pushpakoirala.com.np`
- Your project: `dev-portfolio-hub-51`
- DNS records configured (CNAME/A record details)

---

## ✅ **Verification Steps**

After configuring DNS (wait 5-60 minutes for propagation):

### 1. Check DNS Propagation
```bash
# Check if DNS is propagated
nslookup pushpakoirala.com.np

# Check worldwide propagation
# Visit: https://dnschecker.org/
# Enter: pushpakoirala.com.np
```

### 2. Test Your Domain
```bash
# Test if domain resolves
curl -I https://pushpakoirala.com.np

# or visit in browser
https://pushpakoirala.com.np
```

---

## 🔐 **SSL Certificate (HTTPS)**

Emergent should automatically provision an SSL certificate for your custom domain. If not:

1. **Let's Encrypt** is usually auto-configured
2. Check Emergent dashboard for SSL status
3. It may take 10-30 minutes after domain verification

---

## 📝 **Common DNS Record Examples**

### Example 1: WWW Only
```
Type: CNAME
Name: www
Value: dev-portfolio-hub-51.preview.emergentagent.com
TTL: 3600
```

### Example 2: Root Domain Only
```
Type: A
Name: @
Value: 34.110.232.196 (example IP)
TTL: 3600
```

### Example 3: Both (Recommended)
```
# Record 1
Type: A
Name: @
Value: 34.110.232.196
TTL: 3600

# Record 2
Type: CNAME
Name: www
Value: pushpakoirala.com.np
TTL: 3600
```

---

## 🚨 **Troubleshooting**

### Domain not resolving?
- **Wait longer:** DNS can take up to 48 hours (usually 5-60 minutes)
- **Check DNS:** Use `nslookup pushpakoirala.com.np`
- **Clear cache:** Flush your DNS cache
  ```bash
  # Windows
  ipconfig /flushdns
  
  # Mac/Linux
  sudo dscacheutil -flushcache
  ```

### SSL certificate error?
- Wait 30 minutes after domain starts resolving
- Check Emergent dashboard for SSL provisioning status
- Ensure both HTTP and HTTPS are accessible

### Still showing Emergent URL?
- Verify DNS records are correct
- Check if custom domain is added in Emergent dashboard
- Contact Emergent support for domain verification

---

## 📞 **Get the Deployment IP Address**

To find your deployment's IP address:

```bash
# Method 1: Using nslookup
nslookup dev-portfolio-hub-51.preview.emergentagent.com

# Method 2: Using dig
dig dev-portfolio-hub-51.preview.emergentagent.com +short

# Method 3: Using ping
ping dev-portfolio-hub-51.preview.emergentagent.com
```

The IP address will be something like: `34.110.232.196`

---

## 🎉 **After Setup**

Once your domain is connected:

1. ✅ Your portfolio will be accessible at `https://pushpakoirala.com.np`
2. ✅ SSL certificate will secure all connections
3. ✅ All admin panel features work at your custom domain
4. ✅ Contact form emails will reference your domain

---

## 📌 **Quick Checklist**

- [ ] DNS CNAME record added for `www`
- [ ] DNS A record added for root `@`
- [ ] Custom domain added in Emergent dashboard
- [ ] DNS propagation verified (5-60 minutes)
- [ ] SSL certificate provisioned (10-30 minutes)
- [ ] Test website loads at custom domain
- [ ] Test admin panel at `pushpakoirala.com.np/admin`

---

## 💡 **Pro Tips**

1. **Use both www and non-www** for best accessibility
2. **Set up domain redirects** (www → non-www or vice versa)
3. **Update your social links** to use the new domain
4. **Update email templates** if you have the custom domain in emails
5. **Add to Google Search Console** for SEO

---

**Need Help?**

If you encounter issues:
1. Check Emergent documentation for custom domains
2. Contact Emergent support with your project details
3. Share your DNS records for troubleshooting
4. Verify domain ownership if required

**Your domain will be live within 1 hour after DNS setup! 🚀**
