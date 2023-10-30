let saldoActual = parseInt(localStorage.getItem("saldoGuardado"));
document.getElementById("productoBuscado").value = "";

comprobarSaldo()

class producto {
    constructor(nombreproducto, precioproducto, idproducto, productoproducto) {
        this.nombre = nombreproducto;
        this.precio = precioproducto;
        this.id = idproducto;
        this.numero = productoproducto;
    }
}

//productos
const producto0 = new producto("Yerba Sara 1kg", 200, "producto0", "0");
const producto1 = new producto("Yerba Sara 500g", 120, "producto1", "1");
const producto2 = new producto("Yerba Canarias 1 kg", 250, "producto2", "2");
const producto3 = new producto("Mate Stanley ", 1200, "producto3", "3");
const producto4 = new producto("Termo Stanley", 2000, "producto4", "4");


const listaDeproductos = [producto0, producto1, producto2, producto3, producto4];
let productosComprados = [];
let productoRepetido = false;

comprobarproductosComprados()

//GENERAR PRODUCTOS, NOMBRES Y PRECIOS EN HTML
for (let i = 0; i < 5; i++) {
    $(`#productGames`).append(`<div class="productGames__game" id="articulo${i}">
    <img src="images/producto${i}.png" alt="${listaDeproductos[i].nombre}">
    <div class="productGames__cart">
        <h3 id="producto${i}"></h3>
        <button id="comprarproducto${i}"><img src="images/carrito.png" alt="carrito"></button> 
    </div>
</div>`);
}

for (let i = 0; i < 5; i++) {
    $(`#producto${i}`).html(listaDeproductos[i].nombre + "</br><span>" + listaDeproductos[i].precio + "</span>");
}

//EVENTOS
$("#agregarSaldo").on("click", agregarSaldo);
$("#mostrarproductos").on("click", mostrarproductos);
$("#resetearSaldo").on("click", resetearSaldo);
$("#vaciarproductosComprados").on("click", vaciarproductosComprados);
$("#btnBuscar").on("click", filtrarproductos);
$("#productoBuscado").on("keyup", filtrarproductos);

for (let i = 0; i < 5; i++) {
    $(`#comprarproducto${i}`).on("click", function() {
        comprarproducto(listaDeproductos[i])
    });
}

//METODOS
function agregarSaldo() {
    $("#addBalance").prepend(`
    <div class="modalBackground"></div>
    <div id="modalAlert">
        <h2>Ingrese el saldo a agregar</h2>
        <input type="text" maxlength="7" name="nuevoSaldo" id="nuevoSaldo" onkeypress="return isNumber(event)"></input>
        <p id="errorMessage"></p>
        <div class="modalAlert__buttons">
            <button type="submit" id="btnSubmit" value="Agregar">Agregar</button>
            <button type="button" id="btnCancelar" value="Cancelar">Cancelar</button>
        </div>
    </div>
    `)

    $("#nuevoSaldo").focus();
    $("#btnSubmit").click(extraerValor);
    $("#btnCancelar").click(quitarModal);
    $("#nuevoSaldo").keyup(function(e) {
        if (e.keyCode == 13) {
            extraerValor();
        }
        else if (e.keyCode == 27) {
            quitarModal();
        }
    });
}

function extraerValor() {
    let saldoAgregado = parseInt($("#nuevoSaldo").val());

    if (isNaN(saldoAgregado)) {
        $("#errorMessage").html("El valor ingresado no es un número");
        generarAlerta("El valor ingresado no es un número");
        console.log("El valor ingresado no es un número");
        $("#nuevoSaldo").val('');
        $("#nuevoSaldo").focus();
    }
    else if (saldoAgregado < 0) {
        $("#errorMessage").html("No se aceptan valores negativos");
        generarAlerta("No se aceptan valores negativos");
        console.log("No se aceptan valores negativos");
        $("#nuevoSaldo").val('');
        $("#nuevoSaldo").focus();
    }
    else if (saldoAgregado == 0) {
        $("#errorMessage").html("Debe ingresar un número mayor a 0");
        generarAlerta("Debe ingresar un número mayor a 0");
        console.log("Debe ingresar un número mayor a 0");
        $("#nuevoSaldo").val('');
        $("#nuevoSaldo").focus();
    }
    else if (saldoAgregado > 9999999) {
        $("#errorMessage").html("No puede ingresar un número tan alto");
        generarAlerta("No puede ingresar un número tan alto");
        console.log("No puede ingresar un número tan alto");
        $("#nuevoSaldo").val('');
        $("#nuevoSaldo").focus();
    }
    else if (saldoActual + saldoAgregado > 9999999) {
        $("#errorMessage").html("No se puede exceder el limite de 9999999");
        generarAlerta("No se puede exceder el limite de 9999999");
        console.log("No se puede exceder el limite de 9999999");
        $("#nuevoSaldo").val('');
        $("#nuevoSaldo").focus();
    }
    else {
        saldoActual = saldoActual + saldoAgregado;
        localStorage.setItem("saldoGuardado", saldoActual);

        generarAlerta(`Su nuevo saldo es de <span>${saldoActual}<span>`);
        $("#saldoActual").html(saldoActual);
        console.log(`Recarga de saldo: ${saldoAgregado}`);
        console.log(`Saldo actual: ${saldoActual}`);
        quitarModal();
    }
}

function comprarproducto(productoElegido) {
    let valorproducto = productoElegido.precio;
    let saldoEnProceso = saldoActual - valorproducto;
    let restoSaldo = valorproducto - saldoActual;

    comprobarproducto(productoElegido);

    if (saldoEnProceso < 0) {
        generarAlerta(`Saldo insuficiente, necesita <span>${restoSaldo}</span> mas para realizar la compra de <span>${productoElegido.nombre}</span>`);
        console.log(`Necesita ${restoSaldo} para realizar la compra de ${productoElegido.nombre}`);
    }
    else if (productoRepetido == true) {
        generarAlerta(`Ya adquiriste <span>${productoElegido.nombre}</span>`);
        console.log(`Ya adquiriste ${productoElegido.nombre}`);
    }
    else {
        saldoActual = saldoEnProceso;
        localStorage.setItem("saldoGuardado", saldoActual);
        productosComprados.push(productoElegido.nombre);

        generarAlerta(`Felicidades! Acabas de comprar <span>${productoElegido.nombre}</span>`);
        $("#saldoActual").html(saldoActual);
        $("#listaproductosComprados").html("<h2>" + productosComprados.join("<h2>"));
        $("#cantidadproductos").html(`(${productosComprados.length})`);
        console.log(`producto comprado: ${productoElegido.nombre}, Nuevo saldo: ${saldoActual}`);
        console.log(`productos comprados: ${productosComprados.length}`);
        let productosCompradosJSON = JSON.stringify(productosComprados);
        localStorage.setItem("productosAdquiridos", productosCompradosJSON);
    }
}




function resetearSaldo() {
    if (saldoActual == parseInt(0)) {
        generarAlerta(`Su saldo ya es ${saldoActual}, no puede resetearse`);
    }
    else {
        saldoActual = parseInt(0);
        generarAlerta("Se reseteo el saldo");
        localStorage.setItem("saldoGuardado", saldoActual);
        $("#saldoActual").html(saldoActual);
        console.log(`Se reseteo el saldo, nuevo saldo: ${saldoActual}`);
    }
}

function vaciarproductosComprados() {
    if (productosComprados.length == 0) {
        generarAlerta("La lista de productos ya esta vacia");
    }
    else {
        productosComprados.length = 0;
        $("#listaproductosComprados").html(productosComprados.join());
        $("#cantidadproductos").html(`(${productosComprados.length})`);
        generarAlerta("Se vacio la lista de productos");
        console.log(`Se vacio la lista de productos, nueva cantidad: ${productosComprados.length}`);
        let listaVaciaJSON = JSON.stringify(productosComprados);
        localStorage.setItem("productosAdquiridos", listaVaciaJSON);
    }
}

function comprobarproducto(productoVariable) {
    localStorage.getItem("listaDeproductos");
    let identificarproducto = productoVariable.nombre;
    let buscarproductoEnArray = productosComprados.find(x => x === productoVariable.nombre);

    if (identificarproducto == buscarproductoEnArray) {
        return productoRepetido = true;
    }
    else {
        return productoRepetido = false;
    }
}

function comprobarSaldo() {
    if (isNaN(saldoActual)) {
        saldoActual = parseInt(0);
        $("#saldoActual").html(saldoActual);
        console.log(`Saldo inicial: ${saldoActual}`);
    }
    else {
        $("#saldoActual").html(saldoActual);
        console.log(`Saldo inicial: ${saldoActual}`);
    }
}

function comprobarproductosComprados() {
    let arrayLocal = JSON.parse(localStorage.getItem(`productosAdquiridos`));

    if (arrayLocal == null) {
        console.log(`productos comprados: ${productosComprados.length}`);
    }
    else {
        for (let valor of arrayLocal) {
            productosComprados.push(valor);
        }
        console.log(`productos comprados: ${productosComprados.length}`);
    }

    if (productosComprados.length == 0) {
        $("#listaproductosComprados").html(productosComprados.join("<h2>"));
    }
    else {
        $("#listaproductosComprados").html("<h2>" + productosComprados.join("<h2>"));
    }

    $("#cantidadproductos").html(`(${productosComprados.length})`);
}

function generarAlerta(variableMessage) {
    $("#notifications").append(`
    <div class="generateNotification" style="display: none">${variableMessage}</div>
    `)

    $(".generateNotification").slideDown(350).delay(5000).slideUp(350);
    setTimeout(function() {
        $(".generateNotification:first-child").remove()
    }, 5700)
}

function quitarModal() {
    $(".modalBackground").remove()
    $("#modalAlert").remove()
    $(".pokemodalBackground").remove()
    $("#pokemodalAlert").remove()
}

function filtrarproductos() {
    const productoBuscado = document.getElementById("productoBuscado").value.toLowerCase();

    for (let producto of listaDeproductos) {
        let productoElegido = producto.nombre.toLowerCase();

        if (productoElegido.indexOf(productoBuscado) > -1) {
            $(`#articulo${producto.numero}`).css("display", "");
        }
        else {
            $(`#articulo${producto.numero}`).css("display", "none");
        }
    }

    if ($("#productGames").children(':visible').length == 0) {
        $("#tempMessage").show();
    }
    else {
        $("#tempMessage").hide();
    }
}

function mostrarproductos() {
    $(".productList").toggle()
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}