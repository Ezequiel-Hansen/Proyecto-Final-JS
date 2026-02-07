//Elementos
const divProd=document.querySelector("#productosMain");
const prodTot=document.querySelector(".totalProductos");
const botonCarrito=document.querySelector("#boton-de-compra--carrito");
const mainCardCarrito=document.querySelector(".main__card");
const cat1=document.querySelector(".tabla1");
const cat2=document.querySelector(".tabla2");
const cat3=document.querySelector(".tabla3");
const formBusqueda=document.querySelector("#formBuscar");
const buscador=document.querySelector(".buscadorProd");
const cantidadDeProdspan=document.querySelector("#cantidadProd");
let checkbox1=document.querySelector("#cbox1");
let checkbox2=document.querySelector("#cbox2");
let checkbox3=document.querySelector("#cbox3");
//Molde para los productos
class Productos{
    constructor(id,nombre,precio,imagen,cat){
        this.id=id;
        this.nombre=nombre;
        this.precio=precio;
        this.imagen=imagen;
        this.cat=cat;
    }
}
//Base de datos
class BD{
    constructor(){
        this.productos=[]
    }
    async traeRegistro(){
        const response= await fetch("../json/productos.json");
        this.productos=await response.json();
        return this.productos;
        
    }
    registroPorId(id){
        return this.productos.find((producto)=> producto.id===id)
    }
    registroPorNombre(palabra){
        return this.productos.filter((producto)=>producto.nombre.toLowerCase().includes(palabra))
    }
    registroPorCategoria(cat){
        return this.productos.filter((producto)=> producto.cat.includes(cat))
    }
}
const baseDeDatos=new BD();
//Clase Carrito
class Carrito{
    constructor(){
        const carritoStorage=JSON.parse(localStorage.getItem("carrito"))
        this.carrito= carritoStorage || [];
        this.total=0;
        this.totalCarrito=0;
        this.listar();
    }

    enCarrito({id}){
       return this.carrito.find((producto)=>producto.id===id);
    }
    
    agregarProducto(nuevoProducto){
        const productoEnCarrito=this.enCarrito(nuevoProducto);
        (productoEnCarrito)?productoEnCarrito.cantidad++:this.carrito.push({...nuevoProducto, cantidad:1});
        localStorage.setItem("carrito",JSON.stringify(this.carrito));
        this.listar();
    }

    listar(){
            mainCardCarrito.innerHTML="";
            this.total = 0;
            for(const productos of this.carrito){
                mainCardCarrito.innerHTML +=
                `<div class="section__card--carrito">
                <span id="prodCant">${productos.cantidad}</span>
                <img class="card__image--carrito" src=${productos.imagen} alt="">
                <span class="card__text--carrito">${productos.nombre}</span>
                <button id="boton-eliminar" data-id=${productos.id}>Eliminar</button>
                </div>`;
                this.total += productos.precio * productos.cantidad;
            }
            let botonesQuitar=document.querySelectorAll("#boton-eliminar");
            for(const boton of botonesQuitar){
                boton.addEventListener("click",()=>{
                const id=Number(boton.dataset.id);
                carritoCompras.quitar(id);
            });
            }
            prodTot.innerText=`Total: $${this.total}`;

         }
    quitar(id){
        let index=this.carrito.findIndex((producto)=> producto.id===id);
            if(this.carrito[index].cantidad>1){
                this.carrito[index].cantidad--;
                cantidadDeProdspan.innerText=this.carrito.length
            }
            else{
            this.carrito.splice(index,1);
            cantidadDeProdspan.innerText=this.carrito.length
        } 
        localStorage.setItem("carrito",JSON.stringify(this.carrito));
        this.listar();  
    }
    comprarTodo(){
        this.total=0;
        prodTot.innerText=`Total: $${this.total}`
        mainCardCarrito.innerHTML="";
        this.carrito.splice(0);
        localStorage.setItem("carrito",JSON.stringify(this.carrito));
    }
    cantidadDeProd(){
        cantidadDeProdspan.innerText=this.carrito.length
    }
    
}
//Inializacion de funciones
 const carritoCompras=new Carrito();
 comprarTodoBoton();
// Se cargan los productos en distintas paginas HTML
if (location.pathname=="/pages/producto.html"){
    baseDeDatos.traeRegistro().then((productos)=>cargarProductoCat(productos));
    formBusqueda.addEventListener("keyup",event=>{
        event.preventDefault();
        let palabraABuscar=buscador.value;
        let productoEncontrado=baseDeDatos.registroPorNombre(palabraABuscar.toLowerCase());
        cargarProductoCat(productoEncontrado);
    })
    checkbox1.addEventListener("change",(event)=>{
        if(event.currentTarget.checked){
            cargarProductoCat(baseDeDatos.registroPorCategoria(checkbox1.value))
        }
        else{
            cargarProductoCat(baseDeDatos.productos);

        }
    });
    checkbox2.addEventListener("change",(event)=>{
        if(event.currentTarget.checked){
            cargarProductoCat(baseDeDatos.registroPorCategoria(checkbox2.value))
        }
        else{
            cargarProductoCat(baseDeDatos.productos);

        }
    })
    checkbox3.addEventListener("change",(event)=>{
        if(event.currentTarget.checked){
            cargarProductoCat(baseDeDatos.registroPorCategoria(checkbox3.value))
        }
        else{
            cargarProductoCat(baseDeDatos.productos);

        }
    })
}
else if (location.pathname=="/index.html"){
    baseDeDatos.traeRegistro().then((productos)=>cargarProductoMain(productos));
    formBusqueda.addEventListener("keyup",event=>{
        event.preventDefault();
        let palabraABuscar=buscador.value;
        let productoEncontrado=baseDeDatos.registroPorNombre(palabraABuscar.toLowerCase());
        cargarProductoMain(productoEncontrado);
    })
}
// Funciones para cargar los productos
function cargarProductoCat(productos){
    cat1.innerHTML="";
    cat2.innerHTML="";
    cat3.innerHTML="";
    for(const prd of productos){
        if (prd.cat==="Banda Elastica"){
            cat1.innerHTML+=`              
            <div class="col-7 col-lg-3 col-md-4 card">
            <img class="card__image"src=${prd.imagen} alt="bandas-de-resistencia">
            <span class="card__text">${prd.nombre}</span>
            <p>$${prd.precio}</p>
            <button id="boton-de-compra" data-id=${prd.id}>Agregar</button>`;
        }
        else if(prd.cat==="Paralelas"){
            cat2.innerHTML+=`              
            <div class="col-7 col-lg-3 col-md-4 card">
            <img class="card__image"src=${prd.imagen} alt="bandas-de-resistencia">
            <span class="card__text">${prd.nombre}</span>
            <p>$${prd.precio}</p>
            <button id="boton-de-compra" data-id=${prd.id}>Agregar</button>`;
        }
        else if(prd.cat=="Barras"){
            cat3.innerHTML+=`              
            <div class="col-7 col-lg-3 col-md-4 card">
            <img class="card__image"src=${prd.imagen} alt="bandas-de-resistencia">
            <span class="card__text">${prd.nombre}</span>
            <p>$${prd.precio}</p>
            <button id="boton-de-compra" data-id=${prd.id}>Agregar</button>`;
        }
        let botonesAgregar=document.querySelectorAll("#boton-de-compra");
        for(const boton of botonesAgregar){
        boton.addEventListener("click",()=>{
            const id=Number(boton.dataset.id);
            const producto=baseDeDatos.registroPorId(id);
            carritoCompras.agregarProducto(producto);
            carritoCompras.cantidadDeProd()
            
        });
        };

    }
}

function cargarProductoMain(prod){
    divProd.innerHTML="";
    for (const productos of prod){
        divProd.innerHTML+=`
        <div class="col-7 col-md-5 col-lg-3 card">
        <img class="card__image"src=${productos.imagen} alt="">
        <span class="card__text">${productos.nombre}</span>
        <p class="precio">$${productos.precio}</p>
        <button id="boton-de-compra" data-id=${productos.id}>Agregar</button>
        </div>`;
    }
    let botonesAgregar=document.querySelectorAll("#boton-de-compra");
    for(const boton of botonesAgregar){
    boton.addEventListener("click",()=>{
        const id=Number(boton.dataset.id);
        const producto=baseDeDatos.registroPorId(id);
        carritoCompras.agregarProducto(producto);
        carritoCompras.cantidadDeProd();
        
    });
    };
};
//Funcion del Boton para Comprar todo lo agregado al carrito
function comprarTodoBoton(){
    botonCarrito.addEventListener("click",()=>{
        carritoCompras.comprarTodo();
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Compra Realizada',
            showConfirmButton: false,
            timer: 1500
          })
    });
}


