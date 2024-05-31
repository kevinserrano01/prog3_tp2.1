class Sensor {
    constructor(id, name, type, value, unit, update_at){
        this.id = id;
        this.name = name;
        this.type = type;
        this.value = value;
        this.unit = unit;
        this.update_at = update_at;
    }

    // Funcion para actualizar los campos value y updated_at
    set updateValue(newValue) {
        const valoresPermitidos = ['temperature', 'humidity', 'pressure'];
        // verifico si el valor de this.type está incluido en la lista valoresPermitidos
        if (!valoresPermitidos.includes(this.type)) { 
            console.log('Tipo de sensor no válido');
        }
        this.value = newValue.value; // Actualizar el valor del sensor
        this.updated_at = new Date().toISOString(); // Actualizar la fecha de actualizacion
    }

}

class SensorManager {
    constructor() {
        this.sensors = [];
    }

    // addSensor(sensor) {
    //     this.sensors.push(sensor);
    // }

    updateSensor(id) {
        const sensor = this.sensors.find((sensor) => sensor.id === id);
        if (sensor) {
            let newValue;
            switch (sensor.type) {
                case "temperatura": // Rango de -30 a 50 grados Celsius
                    newValue = (Math.random() * 80 - 30).toFixed(2);
                    break;
                case "humedad": // Rango de 0 a 100%
                    newValue = (Math.random() * 100).toFixed(2);
                    break;
                case "presion": // Rango de 960 a 1040 hPa (hectopascales o milibares)
                    newValue = (Math.random() * 80 + 960).toFixed(2);
                    break;
                default: // Valor por defecto si el tipo es desconocido
                    newValue = (Math.random() * 100).toFixed(2);
            }
            sensor.updateValue = newValue;
            this.render();
        } else {
            console.error(`Sensor ID ${id} no encontrado`);
        }
    }

    async loadSensors(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.log('Sin respuesta...');
            }
            const data = await response.json();
            // console.log(data)
            /* No hago uso de la funcion addSensor() porque con map() puedo ir creando
            instancias de la clase Sensor por cada elemento que iteramos. */
            this.sensors = data.map(sensor => new Sensor(
                sensor.id,
                sensor.name,
                sensor.type,
                sensor.value,
                sensor.unit,
                sensor.updated_at
            ));
            //console.log(this.sensors) // [Sensor, Sensor, Sensor]
            this.render();
        } catch (error) {
            console.error('Ocurrio un error: ', error);
        }
        
    }

    render() {
        const container = document.getElementById("sensor-container");
        container.innerHTML = "";
        this.sensors.forEach((sensor) => {
            // console.log(sensor)
            const sensorCard = document.createElement("div");
            sensorCard.className = "column is-one-third";
            sensorCard.innerHTML = `
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Sensor ID: ${sensor.id}
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                <strong>Tipo:</strong> ${sensor.type}
                            </p>
                            <p>
                               <strong>Valor:</strong> 
                               ${sensor.value} ${sensor.unit}
                            </p>
                        </div>
                        <time datetime="${sensor.updated_at}">
                            Última actualización: ${new Date(
                                sensor.updated_at
                            ).toLocaleString()}
                        </time>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item update-button" data-id="${
                            sensor.id
                        }">Actualizar</a>
                    </footer>
                </div>
            `;
            container.appendChild(sensorCard);
        });

        const updateButtons = document.querySelectorAll(".update-button");
        updateButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const sensorId = parseInt(button.getAttribute("data-id"));
                this.updateSensor(sensorId);
            });
        });
    }
}

const monitor = new SensorManager();
monitor.loadSensors("sensors.json");
