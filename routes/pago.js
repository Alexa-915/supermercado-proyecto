const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const pagoController = require("../controllers/pago");

router.post("/create-checkout-session", pagoController.crearSesion);
router.get("/session/:id", pagoController.obtenerSesion);

router.post("/create-checkout-session", async (req, res) => {
    try {
        const carrito = req.body.carrito;

          console.log("CARRITO RECIBIDO:", carrito);  // 👈 AGREGA ESTO

        if (!carrito || carrito.length === 0) {
            return res.status(400).json({ error: "Carrito vacío" });
        }

        const line_items = carrito.map(item => ({
            price_data: {
                currency: "usd",
                product_data: { name: item.nombre },
                unit_amount: Math.round(item.precio * 100)
            },
            quantity: item.cantidad
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items,
            success_url: "http://localhost:3001/success",
            cancel_url: "http://localhost:3001/cancel"
        });

        console.log("SESION:", session.url);
        res.json({ url: session.url });

    } catch (err) {
        console.error("❌ Error creando sesión:", err);
        res.status(500).json({ error: "Error creando sesión" });
    }
});

module.exports = router;