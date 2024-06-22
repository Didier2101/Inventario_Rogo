import { useState, useEffect } from "react";
import { TextField, List, ListItem, ListItemText, Typography, Grid, Card, CardContent } from "@mui/material";

const Inicio = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const response = await fetch("http://localhost:4000/productos");
      if (response.ok) {
        const data_productos = await response.json();
        setProductos(data_productos);
      } else {
        console.error("No se pudo obtener los productos");
      }
    } catch (error) {
      console.error("Error al obtener los productos", error);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const { value } = e.target;
    setBusqueda(value);
    filtrarProductos(value);
  };

  const filtrarProductos = (termino) => {
    if (termino.trim() === "") {
      setResultados([]);
      return;
    }

    const resultadosFiltrados = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(termino.toLowerCase()) ||
      producto.referencia.toLowerCase().includes(termino.toLowerCase())
    );
    setResultados(resultadosFiltrados);
  };
  return (
    <section className="section-item">

      <div className="header_inicio">
        <div>
          <TextField
            label="Buscar productos"
            value={busqueda}
            onChange={manejarCambioBusqueda}
            fullWidtd
          />
        </div>
        <div>
          <TextField
            label="Buscar clientes"
            value={busqueda}
            onChange={manejarCambioBusqueda}
            fullWidtd
          />
        </div>
      </div>
      <div>
        <Grid container spacing={2}>
          {resultados.map((producto) => (
            <Grid item xs={12} sm={6} md={4} key={producto.id_producto}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {producto.nombre}
                  </Typography>
                  <Typography color="text.secondary">
                    Precio: ${producto.precio_venta}
                  </Typography>
                  <Typography color="text.secondary">
                    Referencia: {producto.referencia}
                  </Typography>
                  <Typography color={producto.cantidad === 0 ? 'error.main' : 'text.secondary'}>
                    {producto.cantidad === 0 ? 'Agotado' : `Stock: ${producto.cantidad}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      <div>
        Aqui van las ventas
      </div>
    </section>
  );
};

export default Inicio;
