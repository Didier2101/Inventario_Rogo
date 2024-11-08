import DescriptionIcon from '@mui/icons-material/Description';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SearchIcon from '@mui/icons-material/Search';


// aqui esta tu codigo

import { Box, Button, IconButton, Modal, TextField, Select, MenuItem, FormControl, InputLabel, InputBase, InputAdornment } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Bodegas = () => {

  const apiUrl = import.meta.env.VITE_API_URL;

  const [busqueda, setBusqueda] = useState('');
  const [productosCount, setProductosCount] = useState({});
  const [modalProductos, setModalProductos] = useState(false)
  const [listaProductos, setListaProductos] = useState([]);
  const [bodegaID, setBodegaID] = useState(null);
  const [modoEditar, setModoEditar] = useState(false);
  const [detalleBodega, setDetalleBodega] = useState(null)
  const [bodegas, setBodegas] = useState([]);
  const [formulario, setFormulario] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    nombres: '',
    telefono: '',
    direccion: '',
    encargado: ''
  });


  useEffect(() => {
    obtenerBodegas();
    obtenerEmpleados();
  }, []);

  const activarModoEdicion = (bodega) => {
    setModoEditar(true);
    setFormulario(true);

    // Buscamos el empleado que corresponde al encargado actual de la bodega
    const encargadoSeleccionado = empleados.find(emp => emp.id_empleado === bodega.encargado);

    // Actualizamos formData con los datos de la bodega seleccionada y el encargado encontrado
    setFormData({
      ...bodega,
      encargado: encargadoSeleccionado ? encargadoSeleccionado.nombres : '', // Utilizamos el nombre del encargado
    });

    setBodegaID(bodega.id_bodega);
  };

  const cambiosInputs = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const obtenerBodegas = async () => {
    try {
      const response = await fetch(`${apiUrl}/bodegas`);
      if (response.ok) {
        const data_bodegas = await response.json();
        setBodegas(data_bodegas);
        // Obtener productos para cada bodega
        const counts = {};
        for (const bodega of data_bodegas) {
          const responseProductos = await fetch(`${apiUrl}/bodegas/${bodega.id_bodega}/productos`);
          if (responseProductos.ok) {
            const data_productos = await responseProductos.json();
            counts[bodega.id_bodega] = data_productos.length;
          } else {
            Swal.fire({
              title: `Error al Cargar Productos`,
              text: `No se pudo obtener los productos para la bodega ${bodega.id_bodega}.`,
              icon: 'error',
            });
          }
        }
        setProductosCount(counts);
      } else {
        Swal.fire({
          title: 'Error al Cargar Bodegas',
          text: 'No se pudo obtener la lista de bodegas.',
          icon: 'error',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error de Conexión',
        text: 'Hubo un problema al intentar obtener las bodegas. Por favor, intenta nuevamente.',
        icon: 'error',
      });
    }
  };

  const obtenerEmpleados = async () => {
    try {
      const response = await fetch(`${apiUrl}/empleados`);
      if (response.ok) {
        const data_empleados = await response.json();
        setEmpleados(data_empleados);
        Swal.fire({
          title: 'Empleados Cargados',
          text: 'La lista de empleados se ha cargado correctamente.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: 'Error al Cargar Empleados',
          text: 'No se pudo obtener la lista de empleados.',
          icon: 'error',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error de Conexión',
        text: 'Hubo un problema al intentar obtener los empleados. Por favor, intenta nuevamente.',
        icon: 'error',
      });
    }
  };

  const eliminarBodega = async (bodegaId, bodegaNombre) => {
    try {
      const result = await Swal.fire({
        title: "Eliminar bodega",
        html: `¿Seguro que quieres eliminar a  <strong>${bodegaNombre}</strong>?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarla!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await fetch(`${apiUrl}/bodegas/${bodegaId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }

        setBodegas(
          bodegas.filter((bodega) => bodega.id_bodega !== bodegaId)
        );

        Swal.fire({
          title: "Eliminada!",
          html: `La bodega <strong>${bodegaNombre}</strong> ha sido eliminada.`,
          icon: "success",
          timer: 1000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  };

  const enviarForm = async (e) => {
    e.preventDefault();
    try {
      let url = `${apiUrl}/bodegas`;
      let method = 'POST';
      if (modoEditar) {
        url += `/${bodegaID}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Verifica si hubo un error en la solicitud
      if (response.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Datos incorrectos o incompletos. Por favor revisa el formulario.',
        });
        return;
      }

      if (!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al procesar la solicitud. Inténtalo de nuevo.',
        });
        return;
      }


      if (modoEditar) {
        Swal.fire({
          title: 'Bodega Actualizada',
          text: 'La bodega ha sido actualizada correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Bodega Agregada',
          text: 'La bodega ha sido agregada correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
      ocultarFormulario();
      obtenerBodegas();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la solicitud',
        text: 'Ocurrió un error al intentar conectar con el servidor. Por favor, inténtalo de nuevo más tarde.',
      });
    }

  };


  /**
 * Obtiene los detalles de una bodega específica por su ID.
 * @param {number} idBodega - ID de la bodega que se desea consultar.
 * @returns {Promise<void>}
 *
 * Realiza una petición GET a la API para obtener la información de una bodega
 * específica y actualiza el estado 'detalleBodega' con la información recibida.
 * En caso de éxito, incluye el nombre del encargado si está disponible en la lista
 * de empleados. Si ocurre un error, se notifica al usuario mediante un mensaje de alerta.
 */
  const obtenerBodegaPorId = async (idBodega) => {
    try {
      const response = await fetch(`${apiUrl}/bodegas/${idBodega}`);
      if (response.ok) {
        const data = await response.json();
        const encargado = empleados.find(emp => emp.id_empleado === data.encargado);
        setDetalleBodega({ ...data, encargado: encargado ? encargado.nombres : 'Desconocido' });
      } else {
        // Si la respuesta no es exitosa, muestra una alerta de error al usuario
        Swal.fire({
          icon: "error",
          title: "Error al obtener la bodega",
          text: "No se pudo obtener la información de la bodega. Por favor, intenta nuevamente.",
        });
      }
    } catch (error) {
      // Manejo de errores de conexión u otros problemas no anticipados
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'Ocurrió un error al intentar conectar con el servidor. Inténtalo de nuevo más tarde.',
      });
    }
  };


  /**
 * Obtiene los productos asociados a una bodega específica y actualiza el estado de la lista de productos.
 * @param {number} idBodega - ID de la bodega de la cual se quieren obtener los productos.
 * @returns {Promise<void>}
 *
 * Realiza una petición GET a la API para obtener los productos de una bodega específica.
 * Si la solicitud es exitosa, actualiza el estado `listaProductos` con los datos de los productos.
 * Muestra mensajes de alerta al usuario en caso de errores.
 */
  const obtenerProductosPorBodega = async (idBodega) => {
    try {
      const response = await fetch(`${apiUrl}/bodegas/${idBodega}/productos`);

      if (response.ok) {
        // La solicitud fue exitosa, obtenemos la lista de productos
        const data_productos = await response.json();
        setListaProductos(data_productos);
      } else {
        // Si la respuesta no es exitosa, muestra un mensaje de error al usuario
        Swal.fire({
          icon: "error",
          title: "Error al obtener productos",
          text: `No se pudo obtener la lista de productos para la bodega con ID: ${idBodega}. Por favor, intenta nuevamente.`,
        });
      }
    } catch (error) {
      // Manejo de errores en la conexión o problemas no anticipados
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'Ocurrió un error al intentar conectar con el servidor. Inténtalo de nuevo más tarde.',
      });
    } finally {
      // Establece el estado para mostrar el modal de productos y oculta el detalle de la bodega
      setModalProductos(true);
      setDetalleBodega(false);
    }
  };



  const mostarFormulario = () => {
    setFormulario(true);
    setModoEditar(false);
  };

  const ocultarFormulario = () => {
    setModalProductos(false);
    setDetalleBodega(null);
    setFormulario(false);
    setFormData({
      nombres: '',
      telefono: '',
      direccion: '',
      encargado: ''
    });
    setListaProductos([]);
    setBusqueda('');
  };

  const style_form = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1100,
    height: 'auto', // Establece una altura específica para permitir el desplazamiento
    bgcolor: 'background.paper',
    pt: 2,
    px: 4,
    pb: 3,
    overflowY: 'auto', // Desplazamiento solo vertical
    '@media (max-width: 600px)': {
      width: '100%',
      position: 'relative',
      top: 'auto',
      left: 'auto',
      transform: 'none',
      pt: 0,
      px: 0,
      pb: 0,
      height: '100vh',
    },
  };


  const style = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '400px',
    height: '100vh',
    bgcolor: 'background.paper',
    overflowY: 'auto',
    '@media (max-width: 600px)': {
      width: '100%',
      position: 'relative', // Corrige 'relativa' a 'relative'
      top: 'auto',
      left: 'auto',
      transform: 'none',
    },
  };



  const [subMenu, setSubMenu] = useState(false)
  const ocultarSubMenu = () => {
    setSubMenu(false)
  };

  const style_list = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    width: '80%',
    height: '80vh', // Establece una altura específica para permitir el desplazamiento
    bgcolor: '#ebf0f4',
    pt: 2,
    px: 4,
    pb: 3,
    overflowY: 'auto', // Desplazamiento solo vertical
    '@media (max-width: 600px)': {
      width: '100%',
      position: 'relative',
      top: 'auto',
      left: 'auto',
      transform: 'none',
      minHeight: '100vh', // Ajusta la altura para pantallas pequeñas
    },
  };

  const capitalizeWords = (str) => {
    return str.split(' ').map(word => capitalize(word)).join(' ');
  };
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const filteredProductos = listaProductos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.referencia.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <section className="section-item">

      <div className=" contenedor_buscar">
        <div className="witches">
          <ul className="witches-list ">
            <li className="witches-item">
              <span className="cantidad-empleados">{bodegas.length}</span>
              Lista de Bodegas
            </li>

          </ul>
        </div>
        <IconButton
          onClick={mostarFormulario}
          style={{ background: 'var(--tercero)' }}>
          <AddIcon style={{ color: 'var(--primer)' }} />
        </IconButton>
      </div>

      <table className="tabla-items">
        <tbody>
          {bodegas.map((bodega, index) => (
            <tr className="fila" key={index}>

              <td className="a2">
                <div className="centered-content">
                  <WarehouseIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {bodega.nombres}
                </div>
              </td>
              <td className="a1">
                <div className="centered-content">
                  <ContactsOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  <div className="contacto">
                    <span>{bodega.telefono}</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#636363' }}> {bodega.direccion}</span>
                  </div>
                </div>
              </td>

              <td className="a1">
                <div className="centered-content">

                  <PersonOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {bodega.encargado}
                </div>
              </td>

              <td className="a1">
                <div className="centered-content" onClick={() => obtenerProductosPorBodega(bodega.id_bodega)}>

                  <InventoryOutlinedIcon style={{ color: '#949393', fontSize: '2rem' }} />
                  <strong>{productosCount[bodega.id_bodega] || 0}</strong>
                  <span>Productos</span>
                </div>
              </td>

              <td className="">
                <div className="centered-content" onClick={() => obtenerProductosPorBodega(bodega.id_bodega)}>
                  <div className="contacto">
                    <Button
                      style={{ width: 'auto', margin: '0 auto', fontSize: '1.1rem' }}
                      variant="outlined"
                      color="primary"
                      size="small"
                      position="endright"
                    >ver mas
                    </Button>
                  </div>
                </div>
              </td>


              <td className="a10">
                <IconButton onClick={() => setSubMenu(bodega.id_bodega)}>
                  <MoreVertIcon

                  />
                </IconButton >
                {subMenu === bodega.id_bodega && (
                  <div className="sub_menu" onMouseLeave={ocultarSubMenu}>

                    <div onClick={() => obtenerBodegaPorId(bodega.id_bodega)}>
                      <IconButton size="small" color="success">
                        <InfoIcon />
                      </IconButton>
                      <span>Detalles</span>
                    </div>

                    <div onClick={() => activarModoEdicion(bodega)}>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                      <span>Editar</span>
                    </div>

                    <div onClick={() => eliminarBodega(bodega.id_bodega, bodega.nombres)}>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                      <span>Eliminar</span>
                    </div>
                  </div>
                )}

              </td>

            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        open={formulario}
        onClose={ocultarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style_form }}>
          <form className="grid-form" onSubmit={enviarForm}>
            <h2 className="title-form">{modoEditar ? 'Editar Bodega' : 'Agregar Bodega'}</h2>
            <p className="sub-title">Todos los campos con un <span>(*)</span> son obligatorios.</p>
            <div className="contain-inputs">
              <TextField
                fullWidth
                label="Nombre de la bodega"
                name="nombres"
                onChange={cambiosInputs}
                value={formData.nombres}
                required
              />
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                onChange={cambiosInputs}
                value={formData.telefono}
                required
              />
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                onChange={cambiosInputs}
                value={formData.direccion}
                required
              />
              <FormControl fullWidth>
                <InputLabel id="encargado-label">Encargado</InputLabel>
                <Select
                  labelId="encargado-label"
                  name="encargado"
                  value={formData.encargado}
                  onChange={cambiosInputs}
                  required
                >
                  {empleados.map((empleado) => (
                    <MenuItem key={empleado.id_empleado} value={empleado.id_empleado}>
                      {empleado.nombres}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>


            </div>
            <div className="contain-btns">
              <Button
                variant="outlined"
                color="error"
                onClick={ocultarFormulario}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="success"
                type="submit"
              > {modoEditar ? 'Guardar cambios' : 'Agregar bodega'}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      <Modal
        open={Boolean(detalleBodega)}
        onClose={ocultarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          {detalleBodega && (
            <div className="contenedor_detalle">
              <div className="cerrar-boton">
                <h2 className="titulo-detalle">Detalles de la bodega</h2>
                <IconButton onClick={ocultarFormulario}>
                  <CloseIcon />
                </IconButton>
              </div>


              <div className="contenedor-detalles">
                <div className="detalle_item">
                  <WarehouseIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Cantidad de productos en bodega {listaProductos[detalleBodega.nombres]}</strong>
                    <span className="detalle_valor"> {productosCount[detalleBodega.id_bodega] || 0}</span>
                  </div>
                </div>


                <div className="detalle_item">
                  <WarehouseIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Nombres del punto de almacenamiento</strong>
                    <span className="detalle_valor">{detalleBodega.nombres}</span>
                  </div>
                </div>

                <div className="detalle_item">
                  <PhoneIphoneOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Teléfono</strong>
                    <span className="detalle_valor">{detalleBodega.telefono}</span>
                  </div>
                </div>
                <div className="detalle_item">
                  <PlaceIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Dirección</strong>
                    <span className="detalle_valor">{detalleBodega.direccion}</span>
                  </div>
                </div>
                <div className="detalle_item">
                  <PersonOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Ecargado del punto</strong>
                    <span className="detalle_valor">{detalleBodega.encargado}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Box>
      </Modal >
      <Modal
        open={modalProductos}
        onClose={ocultarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style_list }}>
          <div className="cerrar-boton" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>

            <InputBase
              style={{
                width: 'auto',
                borderRadius: '14px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                paddingLeft: '10px',
                fontSize: '1.2rem',
                marginRight: '10px',
              }}
              placeholder="Buscar productos"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon style={{ color: '#949393', fontSize: '1.5rem', }} />
                </InputAdornment>
              }
            />

            <IconButton onClick={() => setModalProductos(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          {listaProductos.length === 0 ? (
            <p style={{ textAlign: 'center', fontSize: '3rem', marginTop: '120px' }}>No hay productos almacenados en esta bodega</p>
          ) : (
            filteredProductos.length === 0 ? (
              <p style={{ textAlign: 'center', fontSize: '3rem', marginTop: '120px' }}>No se encontró el producto</p>
            ) : (
              <table className="tabla-items">
                <tbody>
                  {filteredProductos.map((producto) => (
                    <tr className="fila" key={producto.id_producto}>
                      <td className="a2">
                        <div className="centered-content">
                          <Inventory2OutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                          {capitalizeWords(producto.nombre)}
                        </div>
                      </td>
                      <td className="a1">
                        <div className="centered-content">
                          <QrCodeIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                          {capitalizeWords(producto.referencia)}
                        </div>
                      </td>
                      <td className="a1">
                        <div className="centered-content">
                          <DescriptionIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                          {capitalizeWords(producto.descripcion)}

                        </div>
                      </td>
                      <td className={producto.cantidad === 0 ? 'agotado' : 'a9'}>
                        <div className="centered-content">
                          <InventoryOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                          <strong>{producto.cantidad}</strong>
                          <span>Unidades</span>
                        </div>
                      </td>
                      <td className='a10'>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                        >Mover</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </Box>
      </Modal>


    </section >
  );

};

export default Bodegas;
