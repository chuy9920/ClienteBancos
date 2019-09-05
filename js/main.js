var idModificar = 0;
// $('#mimodalejemplo').modal({backdrop: 'static', keyboard: false})   
$(function() {

    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
      })

      obtenerCuentasBancarias();

      llenaBancos();
      $( "#enviar" ).click(accionUser);

      $(".cierraModal").click(() => {
        idModificar = 0;
      });

      // $('#agregar').click(verificar);
});
function verificar() {
  if (idModificar > 0) {
    obtenerUnRegistro();
  }
}


function accionUser() {
  if (idModificar > 0) {
    editarCuenta()
  } else if (idModificar === 0) {
    guardarCuenta();
  }
}

function limpiarCampos() {
  $('#alias').val("");
  $('select[id=bancos]').val("");
}

function llenaBancos() {
  console.log('Entra aquí');
  $.ajax({
    type: "GET",
    url: api + 'bancos',
    headers: {
      'Content-Type': 'application/json'
    },
    success: (response) => {
      if (response.length > 0) {
        // console.log(JSON.parse(response));
        $(response).each((index, value) => {
          console.log(value);
          let elemento = '<option value =' + value.id + '>' + value.nombre_corto + '</option>';
          $('#bancos').append(elemento);
          console.log(elemento);
          $('#agregar').attr('disabled', false);
        });
      }
    }
  });
}

function guardarCuenta() {
  if ($('#alias').val().length > 0 && $('#ultimos_digit').val().length > 0) {
    console.log('Si entra añ save');
    var data = {
      alias: $('#alias').val(),
      id_banco: $('select[id=bancos]').val(),
      ultimos_digitos: $('#ultimos_digit').val()
    };
    var cad = JSON.stringify(data);
    $.ajax({
      type: "POST",
      url: api + 'cuentas',
      data: cad,
      headers: {
        'Content-Type': 'application/json'
      },
      success: (response) => {
        console.log(response);
        // $('.alert').alert()
        $('#alert').show();
        $('#error').hide();
        limpiarCampos();
        obtenerCuentasBancarias();
        $('#modalForm').modal("hide");
        alert('Cuenta agregada correctamente');
      },
      error: function(){
        $('#alert').hide();
        $('#error').show();
    }
    });
  } else {
      alert('Campos vacíos')
  }
}

function obtenerCuentasBancarias() {
  $.ajax({
    type: 'GET',
    url: api + 'cuentasBancos',
    headers: {
      'Content-Type': 'application/json'
    },
    success: (response) => {
      if (response.length > 0) {
        $('#divCuentas').empty()
        let columnas = '<div class="row" id="columnas"></div>'
        $('#divCuentas').append(columnas);
        // console.log(JSON.parse(response));
        $(response).each((index, value) => {
          let elemento = "";
          elemento += `
          <div class="col-sm-3">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title">${value.alias}</h4>
                <h6 class="card-title">Banco: ${value.nombre_corto}</h6>
                <p class="card-text">Ultimos dígitos: ${value.ultimos_digitos}</p>
                <div class="btn-group">
                  <a href="#" class="btn btn-primary botones" onclick="editaCuenta(${value.id})" data-toggle="modal" data-target="#modalForm">Editar</a>
                  <a href="#" class="btn btn-danger botones" onclick="eliminaCuenta(${value.id})">Eliminar</a>
                </div>
              </div>
            </div>
          </div>
          `
          $('#columnas').append(elemento);
        });
      }
    }
  });
}

function editaCuenta(id) {
  idModificar = id;
  verificar();
}

function editarCuenta() {
  if ($('#alias').val().length > 0 && $('#ultimos_digit').val().length > 0) {

    var data = {
      alias: $('#alias').val(),
      id_banco: $('select[id=bancos]').val(),
      ultimos_digitos: $('#ultimos_digit').val()
    };
    var cad = JSON.stringify(data);
      $.ajax({
        type: "PUT",
        url: api + 'cuentas/' + idModificar,
        data: cad,
        headers: {
          'Content-Type': 'application/json'
        },
        success: (response) => {
          console.log(response);
          $('#alert').show();
          $('error').hide();
          idModificar = 0;
          obtenerCuentasBancarias();
          $('#modalForm').modal("hide");
        },
        error: function(){
          $('#alert').hide();
          $('error').show();
        }
    });
  }
}

function obtenerUnRegistro() {
  $.ajax({
    type: "GET",
    url: api + 'cuentasBancos/' + idModificar,
    headers: {
      'Content-Type': 'application/json'
    },
    success: (response) => {
      $(response).each((index, value) => {
        $('#alias').val(value.alias);
        $('#ultimos_digit').val(value.ultimos_digitos);
        $("#bancos option[value="+ value.id_banco +"]").attr("selected",true);
      }
    )}
  });
}

function eliminaCuenta (id) {
  if (confirm('Realmente lo desea eliminar?')) {
    if (id > 0) {
      $.ajax({
        type: 'DELETE',
        url: api + '/cuentas/' + id,
        headers: {
          'Content-Type': 'application/json'
        },
        success: (response => {
          console.log(response);
          obtenerCuentasBancarias();
        })
      });
    }
  }
}