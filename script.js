window.onload = ()=>{

    
var tiempo = document.getElementById('start');
var fecha = moment(new Date(), 'YYYY-MM-dd');
fecha = fecha.format('YYYY-MM-DD');
console.log(fecha)
// fecha = '2021-03-03';
var ctx = document.getElementById("myChart").getContext("2d");

tiempo.value = fecha;
console.log("Fecha tiempo: "+tiempo.value)


var busca = document.getElementById('busca');
busca.addEventListener('click', () => {
    console.log(tiempo.value)
    newData()
})

var oldData = [0, 0, 0, 0]
//----------  GRAFICAS CHART ------------------
var myChart = new Chart(ctx, {
    type: "pie", //bar, pie
    data: {
        labels: ['Nuevos casos', 'Fallecidos hoy', 'Recuperados hoy', 'Nuevos hospitalizados hoy'],
        datasets: [{
            label: 'Nuevos datos diarios',
            data: oldData,
            backgroundColor: [
                'rgb(255, 255, 0,0.5)',
                'rgb(204, 0, 0, 0.5)',
                'rgb(51, 204, 51, 0.5)',
                'rgb(0, 102, 255, 0.5)'
            ],
            borderWidth: 1,
            borderColor: 'red',
            fill: false
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});


var provincia = document.getElementById('andalucia');
var nombre = '';
var nuevosCasos = '';
var muertes = '';
var recuperados = '';
var nuevosHospitalizados = '';
// ------------------ PETICION API COVID -------------------
async function newData() {
    fetch(`https://api.covid19tracking.narrativa.com/api/${tiempo.value}/country/spain/region/andalucia/sub_region/${provincia.value}`)
        .then(response => response.json())
        .then(data => {
            
            console.log('Provincia: ' + data.dates[tiempo.value].countries.Spain.regions['0'].sub_regions['0'].name)
            console.log('Nuevos casos: ' + data.dates[tiempo.value].countries.Spain.regions['0'].sub_regions['0'].today_new_confirmed)
            console.log('Nuevas muertes: ' + data.dates[tiempo.value].countries.Spain.regions['0'].sub_regions['0'].today_new_deaths)
            console.log('Recuperados: ' + data.dates[tiempo.value].countries.Spain.regions['0'].sub_regions['0'].today_new_recovered)
            console.log('Recuperados: ' + data.dates[tiempo.value].countries.Spain.regions['0'].sub_regions['0'].today_new_total_hospitalised_patients)
            nombre = data.dates[tiempo.value].countries.Spain.regions['0'].sub_regions['0'].name;
            nuevosCasos = data.dates[tiempo.value].countries.Spain.regions['0'].sub_regions['0'].today_new_confirmed;
            muertes = data.dates[tiempo.value].countries.Spain.regions['0'].sub_regions['0'].today_new_deaths;
            recuperados = data.dates[tiempo.value].countries.Spain.regions['0'].sub_regions['0'].today_new_recovered;
            nuevosHospitalizados = data.dates[tiempo.value].countries.Spain.regions['0'].sub_regions['0'].today_new_total_hospitalised_patients;

            myChart.data.datasets[0].data = [nuevosCasos, muertes, recuperados, nuevosHospitalizados]
            myChart.update();

            document.getElementById('info').textContent = `Nuevos casos: ${nuevosCasos}  Fallecidos: ${muertes} 
            Recuperados: ${recuperados}  Hospitalizados: ${nuevosHospitalizados} `;
            document.getElementById('nombreProvincia').textContent = `Provincia: ${nombre} `

        })
        .catch(err => {
            console.log(err.message)
        })


}


provincia.addEventListener('click', () => {
    console.log(provincia.value)
    newData()
})

}
