import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint Registrasi
app.post('/api/users', async (req, res) => {
  try {
    console.log("Data diterima dari Flutter (Register):", req.body);
    
    const newUser = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role || "SISWA",
        guru_uid: req.body.guru_uid,
        pkl_place_name: req.body.pkl_place_name,
        pkl_place_address: req.body.pkl_place_address,
        latitude: req.body.pkl_lat ? parseFloat(req.body.pkl_lat) : null,
        longitude: req.body.pkl_lng ? parseFloat(req.body.pkl_lng) : null,
      },
    });

    res.status(201).json({ message: "Sukses!", user: newUser });
  } catch (error: any) {
    console.error("DEBUG ERROR PRISMA:", JSON.stringify(error, null, 2));
    res.status(500).json({ error: error.message });
  }
});

// Endpoint Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Data login diterima:", { email });

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "Email tidak ditemukan!" });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Password salah!" });
    }

    res.status(200).json({
      success: true,
      message: "Login berhasil!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        pkl_place_name: user.pkl_place_name,
        pkl_place_address: user.pkl_place_address,
      },
    });

  } catch (error: any) {
    console.error("DEBUG ERROR LOGIN:", JSON.stringify(error, null, 2));
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint Logbook (BARU)
app.post('/api/logbook', async (req, res) => {
  try {
    console.log("Data logbook diterima:", req.body);
    
    const newLogbook = await prisma.logbook.create({
      data: {
        user_uid: req.body.user_uid,
        activity: req.body.activity,
        date: req.body.date ? new Date(req.body.date) : new Date(),
        status: req.body.status || "PENDING",
      },
    });

    res.status(201).json({ message: "Logbook berhasil disimpan!", data: newLogbook });
  } catch (error: any) {
    console.error("DEBUG ERROR LOGBOOK:", JSON.stringify(error, null, 2));
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});