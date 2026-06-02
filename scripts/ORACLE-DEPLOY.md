# Deploy PRISM Worker ke Oracle Cloud Free Tier

## Kenapa dua tempat?
- **Lokal (laptop kamu)** → Connect Account (buka browser visible untuk login)
- **Oracle Cloud** → Background worker posting 24/7 (headless, pakai session dari Firestore)

---

## Step 1 — Buat Oracle Cloud Account
1. Buka https://cloud.oracle.com/free
2. Daftar (butuh kartu kredit untuk verifikasi, tapi TIDAK dicharge)
3. Pilih region terdekat: **ap-singapore-1** (Singapore)

---

## Step 2 — Buat VM Instance
1. Masuk Oracle Cloud Console
2. Klik **Create a VM instance**
3. Isi settings:
   - **Name**: prism-worker
   - **Image**: Ubuntu 22.04
   - **Shape**: VM.Standard.A1.Flex (ARM — Always Free)
     - OCPU: 2, Memory: 12 GB
   - **SSH keys**: Upload public key kamu (atau buat baru)
4. Klik **Create**
5. Tunggu status: **Running** (~2-3 menit)
6. Copy **Public IP address**

---

## Step 3 — Buka Port di Security List
1. Masuk ke instance → **Subnet** → **Default Security List**
2. **Add Ingress Rules**:
   - Port 22 (SSH) — biasanya sudah ada
3. Port 3002 TIDAK perlu dibuka (capture server disabled di cloud)

---

## Step 4 — SSH ke Server
```bash
ssh ubuntu@<YOUR_PUBLIC_IP>
```

---

## Step 5 — Jalankan Setup Script
```bash
curl -fsSL https://raw.githubusercontent.com/designbyfatur/prism/main/scripts/setup-oracle.sh | bash
```

---

## Step 6 — Isi Environment Variables
```bash
nano /home/ubuntu/prism/apps/worker/.env
```

Isi dengan:
```
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}  ← paste minified JSON
ENCRYPTION_KEY=<SAME_KEY_AS_YOUR_LOCAL_ENV>                 ← sama dengan lokal
ENABLE_CAPTURE_SERVER=false
WORKER_POLL_INTERVAL_MS=60000
```

> **Penting**: ENCRYPTION_KEY harus sama persis dengan yang di lokal, karena sessions di Firestore dienkripsi dengan key ini.

---

## Step 7 — Install & Start Service
```bash
sudo cp /home/ubuntu/prism/apps/worker/prism-worker.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable prism-worker
sudo systemctl start prism-worker
```

---

## Cek Status
```bash
# Status service
sudo systemctl status prism-worker

# Live logs
sudo journalctl -u prism-worker -f

# Restart kalau ada update
cd /home/ubuntu/prism && git pull && sudo systemctl restart prism-worker
```

---

## Update Worker (setelah push ke GitHub)
```bash
ssh ubuntu@<YOUR_IP>
cd /home/ubuntu/prism
git pull origin main
sudo systemctl restart prism-worker
```

---

## Alur Lengkap
1. **Lokal**: Connect Account → Playwright buka browser → user login → session tersimpan di Firestore
2. **Oracle Cloud**: Worker poll Firestore tiap 60 detik → posting otomatis pakai session tersimpan
