const User = require("../models/User");

// POST /users/sync -> registra l'utente al primo accesso o aggiorna lastLogin
exports.syncGoogleUser = async (req, res) => {
  const { googleId, email, displayName, firstName, avatar } = req.body;

  if (!googleId || !email) {
    return res.status(400).json({
      error: true,
      message: "googleId ed email sono obbligatori",
    });
  }

  try {
    const user = await User.findOneAndUpdate(
      { googleId },
      {
        $set: {
          email,
          displayName: displayName || firstName || "Utente",
          firstName: firstName || "utente",
          avatar: avatar || "",
          lastLogin: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    console.log(`Utente sincronizzato su MongoDB: ${user.email} (${user._id})`);
    res.status(200).json({ status: "ok", user });
  } catch (err) {
    console.error("Errore sincronizzazione utente su MongoDB:", err);
    res.status(500).json({ error: true, message: "Errore salvataggio utente" });
  }
};