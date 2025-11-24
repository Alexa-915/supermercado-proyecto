// controllers/pago.js
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const pagoController = {};

// Crear sesión de pago (Stripe Checkout)
pagoController.crearSesion = async (req, res) => {
  try {
    const carrito = req.body.carrito;

    if (!carrito || carrito.length === 0) {
      return res.status(400).json({ error: "Carrito vacío" });
    }

    // Convertimos los productos del carrito en line_items
    const line_items = carrito.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.nombre },
        unit_amount: Math.round(item.precio * 100) // convertir a centavos
      },
      quantity: item.cantidad
    }));

    // Crear sesión de pago en Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: "http://localhost:3001/success",
      cancel_url: "http://localhost:3001/cancel"
    });

    return res.json({ url: session.url });

  } catch (error) {
    console.error("❌ Error en pagoController.crearSesion:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Verificar sesión de pago
pagoController.obtenerSesion = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await stripe.checkout.sessions.retrieve(id);

    return res.json(session);

  } catch (error) {
    console.error("❌ Error en pagoController.obtenerSesion:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = pagoController;