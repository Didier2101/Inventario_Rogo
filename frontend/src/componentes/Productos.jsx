import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Box, Button, Divider, IconButton, Modal, TextField, Tooltip, Select, MenuItem, FormControl, InputLabel, Switch, Paper, InputBase } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from '@mui/icons-material/MoreVert';



import SearchIcon from '@mui/icons-material/Search';


const Productos = () => {



  const [busqueda, setBusqueda] = useState('');
  const [productoID, setProductoID] = useState(null);
  const [modoEditar, setModoEditar] = useState(false);
  const [detalleProducto, setDetalleProducto] = useState(null);
  const [subMenu, setSubMenu] = useState(null);
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [formData, setFormData] = useState({
    proveedor: '',
    bodega: '',
    nombre: '',
    referencia: '',
    descripcion: '',
    precio_compra: '',
    precio_venta: '',
    cantidad: '',
    estado: 1, // Opcionalmente puedes establecer el valor inicial como `true` o `false`
  });



  const activarModoEdicion = (producto) => {
    const bodega = bodegas.find(b => b.id_bodega === producto.bodega);
    const proveedor = proveedores.find(p => p.id_proveedor === producto.proveedor);
    setModoEditar(true);
    setFormulario(true);
    setFormData({
      proveedor: proveedor ? proveedor.id_proveedor : '', // Usar el ID del proveedor
      bodega: bodega ? bodega.id_bodega : '',
      nombre: producto.nombre,
      referencia: producto.referencia,
      descripcion: producto.descripcion,
      precio_compra: producto.precio_compra,
      precio_venta: producto.precio_venta,
      cantidad: producto.cantidad,
      estado: producto.estado
    });
    setProductoID(producto.id_producto);
  };

  const cambiosInputs = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
      console.error('Error al obtener los productos', error);
    }
  };

  const obtenerProveedores = async () => {
    try {
      const response = await fetch("http://localhost:4000/proveedores");
      if (response.ok) {
        const data_proveedores = await response.json();
        setProveedores(data_proveedores);
      } else {
        console.error("No se pudo obtener los proveedores");
      }
    } catch (error) {
      console.error('Error al obtener los proveedores', error);
    }
  };

  const obtenerBodegas = async () => {
    try {
      const response = await fetch("http://localhost:4000/bodegas");
      if (response.ok) {
        const data_bodegas = await response.json();
        setBodegas(data_bodegas);
      } else {
        console.error("No se pudo obtener las bodegaes");
      }
    } catch (error) {
      console.error('Error al obtener las bodegaes', error);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerProveedores();
    obtenerBodegas();
  }, []);



  const enviarForm = async (e) => {
    e.preventDefault();
    try {
      let url = 'http://localhost:4000/productos';
      let method = 'POST';



      if (modoEditar) {
        url += `/${productoID}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData }),
      });

      if (response.status === 400) {
        const data = await response.json();
        if (data.error && data.error === "REFERENCIA_DUPLICADA") {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message,
          });
          return;
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al agregar o actualizar el producto:', errorData.message);
        return;
      }

      if (modoEditar) {
        Swal.fire({
          title: 'Producto Actualizado',
          text: 'El producto ha sido actualizado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Producto Agregado',
          text: 'El producto ha sido agregado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
      ocultarFormulario();
      obtenerProductos();
      setFormData({
        activo: true,
      });
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }

  };

  const obtenerProductoPorId = async (idProducto) => {
    try {
      const response = await fetch(`http://localhost:4000/productos/${idProducto}`);
      if (response.ok) {
        const data = await response.json();

        // Buscar la bodega correspondiente
        const bodega = bodegas.find(b => b.id_bodega === data.bodega);

        // Buscar el proveedor correspondiente
        const proveedor = proveedores.find(p => p.id_proveedor === data.proveedor);

        // Actualizar el detalle del producto
        setDetalleProducto({
          ...data,
          bodega: bodega ? bodega.nombres : 'Desconocida',
          proveedor: proveedor ? proveedor.empresa : 'Desconocido'
        });
      } else {
        console.error("No se pudo obtener el producto");
      }
    } catch (error) {
      console.error('Error al obtener el producto', error);
    }
  };



  const eliminarProducto = async (productoId, productoNombre) => {
    try {
      const result = await Swal.fire({
        title: "Eliminar producto",
        html: `¿Seguro que quieres eliminar a <strong>${productoNombre}</strong>?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await fetch(`http://localhost:4000/productos/${productoId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }

        setProductos(
          productos.filter((producto) => producto.id_producto !== productoId)
        );

        Swal.fire({
          title: "Eliminado!",
          html: `El producto <strong>${productoNombre}</strong> ha sido eliminado.`,
          icon: "success",
          timer: 1000,
          showConfirmButton: false
        });
      }
      obtenerProductos();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  };

  const mostarFormulario = () => {
    setFormulario(true);
    setModoEditar(false);
  };

  const ocultarFormulario = () => {
    setDetalleProducto(null);
    setFormulario(false);
    setFormData({
      proveedor: '',
      bodega: '',
      nombre: '',
      referencia: '',
      descripcion: '',
      precio_compra: '',
      precio_venta: '',
      cantidad: '',
      estado: true,
    });
  };

  const style_form = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '90%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    overflow: 'auto',
    borderRadius: '10px',
    overflowY: 'auto',
    border: 'none',
    '@media (max-width: 600px)': {
      width: '100%',
      position: 'relative',
      top: 'auto',
      left: 'auto',
      transform: 'none',
    },
  };

  const style = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: '0',
    right: '0',
    width: '500px',
    maxHeight: '100vh',
    bgcolor: 'background.paper',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    borderRadius: 'none',
    height: '100vh',
    overflowY: 'auto',
    '@media (max-width: 600px)': {
      width: '90%',
      position: 'relative',
    },
  };

  const mostrarSubMenu = (index) => {
    setSubMenu(index);
  };

  const quitarSubMenu = () => {
    setSubMenu(null);
  };

  const toggleEstado = async (id_producto, nuevoEstado) => {
    try {
      const response = await fetch(`http://localhost:4000/productos/${id_producto}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (response.ok) {
        // Actualizar el estado local de productos
        setProductos(productos.map((producto) =>
          producto.id_producto === id_producto ? { ...producto, estado: nuevoEstado } : producto
        ));
      } else {
        console.error('No se pudo actualizar el estado del producto');
      }
    } catch (error) {
      console.error('Error al actualizar el estado del producto', error);
    }
  };
  const mostrarEstadoTexto = (estado) => {
    return estado ? 'Activo' : 'Inactivo';
  };

  return (
    <section className="section-item">
      <section className="caja-section">
        <Paper
          component="form"
          sx={{ p: '4px 8px', display: 'flex', alignItems: 'center', width: '100%' }}
        >

          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Buscar productos"
            inputProps={{ 'aria-label': '' }}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}

          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <Divider sx={{ height: 28, mr: '12px' }} orientation="vertical" />
          <IconButton
            color="primary" sx={{ p: '8px' }}
            onClick={mostarFormulario}
            style={{ background: 'var(--tercero)' }}>
            <AddIcon style={{ color: 'var(--primer)' }} />
          </IconButton>
        </Paper>

      </section>


      <Paper>
        <table className="tabla-items">
          <thead>
            <tr>
              <th>#</th>
              <th>Proveedor</th>
              <th>Ubicación</th>
              <th>Nombre</th>
              <th>Referencia</th>
              <th>Descripción</th>
              <th>Precio de Compra</th>
              <th>Precio de Venta</th>
              <th>Stock</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {productos
              .filter((producto) =>
                producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                producto.proveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
                producto.bodega.toLowerCase().includes(busqueda.toLowerCase()) ||
                producto.referencia.toLowerCase().includes(busqueda.toLowerCase())
              )
              .map((producto, index) => (
                <tr className="fila" key={index}>
                  <td className="one"><strong>{index + 1}</strong></td>
                  <td className="five">{producto.proveedor}</td>
                  <td className="five">{producto.bodega}</td>
                  <td className="eight">{producto.nombre}</td>
                  <td>{producto.referencia}</td>
                  <td className="six">{producto.descripcion}</td>
                  <td>{producto.precio_compra}</td>
                  <td>{producto.precio_venta}</td>
                  <td className={producto.cantidad === 0 ? 'agotado' : ''}>
                    {producto.cantidad === 0 ? 'Agotado' : producto.cantidad}
                  </td>
                  <td className="estado">
                    <Switch
                      checked={!!producto.estado}
                      color="success"
                      onChange={() => toggleEstado(producto.id_producto, !producto.estado)}
                    />
                  </td>
                  <td className="acciones ten">
                    <IconButton size="small" color="success"
                      onMouseEnter={() => mostrarSubMenu(index)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    {subMenu === index && (
                      <div className="sub_menu" onMouseLeave={quitarSubMenu}>
                        <Tooltip title="Eliminar">
                          <IconButton size="small" color="error"
                            onClick={() => eliminarProducto(producto.id_producto, producto.nombre)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar" onClick={() => activarModoEdicion(producto)}>
                          <IconButton size="small" color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Detalles">
                          <IconButton size="small" color="success"
                            onClick={() => obtenerProductoPorId(producto.id_producto)}
                          >
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Paper>

      <Modal
        open={formulario}
        onClose={ocultarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style_form }}>
          <form className="grid-form" onSubmit={enviarForm}>
            <h2 className="title-form">{modoEditar ? 'Editar Producto' : 'Agregar Producto'}</h2>
            <p className="sub-title">Todos los campos con un <span>(*)</span> son obligatorios.</p>
            <div className="contain-inputs">
              <TextField
                fullWidth
                label="Referencia"
                name="referencia"
                onChange={cambiosInputs}
                value={formData.referencia}
                required
              />
              <TextField
                fullWidth
                label="Nombre del producto"
                name="nombre"
                onChange={cambiosInputs}
                value={formData.nombre}
                required
              />
              <TextField
                fullWidth
                label="Cantidad"
                name="cantidad"
                onChange={cambiosInputs}
                value={formData.cantidad}
                required
              />
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                onChange={cambiosInputs}
                value={formData.descripcion}
                required
              />
              <TextField
                fullWidth
                label="Precio de Compra"
                name="precio_compra"
                onChange={cambiosInputs}
                value={formData.precio_compra}
                required
              />
              <TextField
                fullWidth
                label="Precio de Venta"
                name="precio_venta"
                onChange={cambiosInputs}
                value={formData.precio_venta}
                required
              />
              <FormControl fullWidth>
                <InputLabel id="bodega-label">Ubicación</InputLabel>
                <Select
                  labelId="bodega-label"
                  name="bodega"
                  value={formData.bodega}
                  onChange={cambiosInputs}
                  required
                >
                  {bodegas.map((bodega) => (
                    <MenuItem key={bodega.id_bodega} value={bodega.id_bodega}>
                      {bodega.nombres}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="proveedor-label">Proveedor</InputLabel>
                <Select
                  labelId="proveedor-label"
                  name="proveedor"
                  value={formData.proveedor}
                  onChange={cambiosInputs}
                  required
                >
                  {proveedores.map((proveedor) => (
                    <MenuItem key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                      {proveedor.empresa}
                    </MenuItem>

                  ))}

                </Select>

              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="estado-label">Estado</InputLabel>
                <Select
                  labelId="estado-label"
                  name="estado"
                  value={formData.estado}
                  onChange={cambiosInputs}
                  required
                >
                  <MenuItem value={1}>Activo</MenuItem>
                  <MenuItem value={0}>Inactivo</MenuItem>
                </Select>
              </FormControl>







            </div>
            <Divider />
            <div className="contain-btns">
              <Button
                variant="contained"
                color="error"
                onClick={ocultarFormulario}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="success"
                type="submit"
              > {modoEditar ? 'Editar' : 'Agregar'}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      <Modal
        open={Boolean(detalleProducto)}
        onClose={ocultarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          {detalleProducto && (
            <div className="contenedor_detalle">
              <div className="cerrar-boton">
                <h2 className="titulo-detalle">Detalles del Producto</h2>
                <IconButton onClick={ocultarFormulario}>
                  <CloseIcon />
                </IconButton>
              </div>
              <div className="contenedor-detalles">

                <div className="detalle_item">
                  <strong className="detalle_titulo">Proveedor:</strong>
                  <span className="detalle_valor">{detalleProducto.proveedor}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Ubicación:</strong>
                  <span className="detalle_valor">{detalleProducto.bodega}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Nombre:</strong>
                  <span className="detalle_valor">{detalleProducto.nombre}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Referencia:</strong>
                  <span className="detalle_valor">{detalleProducto.referencia}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Descripción:</strong>
                  <span className="detalle_valor">{detalleProducto.descripcion}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Precio de Compra:</strong>
                  <span className="detalle_valor">{detalleProducto.precio_compra}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Precio de Venta:</strong>
                  <span className="detalle_valor">{detalleProducto.precio_venta}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Cantidad:</strong>
                  <span className="detalle_valor">{detalleProducto.cantidad}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Estado:</strong>
                  <span className="detalle_valor">
                    {mostrarEstadoTexto(detalleProducto.estado)}
                  </span>
                </div>

              </div>
            </div>
          )}
        </Box>
      </Modal>
    </section>
  );
};

export default Productos;