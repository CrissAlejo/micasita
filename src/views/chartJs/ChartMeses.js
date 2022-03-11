import React from 'react';
import { Bar } from 'react-chartjs-2';
import * as FirestoreService from './services/firestore';

export class BarChartMeses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataIng1: 0, dataEgr1: 0,
      dataIng2: 0, dataEgr2: 0,
      dataIng3: 0, dataEgr3: 0,
      dataIng4: 0, dataEgr4: 0,
      dataIng5: 0, dataEgr5: 0,
      dataIng6: 0, dataEgr6: 0,
      dataIng7: 0, dataEgr7: 0,
      dataIng8: 0, dataEgr8: 0,
      dataIng9: 0, dataEgr9: 0,
      dataIng10: 0, dataEgr10: 0,
      dataIng11: 0, dataEgr11: 0,
      dataIng12: 0, dataEgr12: 0,
    };
  }

  cargarDatos() {
    if (this.props.data !== undefined) {
      for (let index = 0; index < 12; index++) {
        FirestoreService.getTotInEg(this.props.data, index).then((res) => {
          switch (index + 1) {
            case 1:
              this.setState({
                dataIng1: res.totalIn,
                dataEgr1: res.totalEg
              });
              break;
            case 2:
              this.setState({
                dataIng2: res.totalIn,
                dataEgr2: res.totalEg
              });
              break;
            case 3:
              this.setState({
                dataIng3: res.totalIn,
                dataEgr3: res.totalEg
              });
              break;
            case 4:
              this.setState({
                dataIng4: res.totalIn,
                dataEgr4: res.totalEg
              });
              break;
            case 5:
              this.setState({
                dataIng5: res.totalIn,
                dataEgr5: res.totalEg
              });
              break;
            case 6:
              this.setState({
                dataIng6: res.totalIn,
                dataEgr6: res.totalEg
              });
              break;
            case 7:
              this.setState({
                dataIng7: res.totalIn,
                dataEgr7: res.totalEg
              });
              break;
            case 8:
              this.setState({
                dataIng8: res.totalIn,
                dataEgr8: res.totalEg
              });
              break;
            case 9:
              this.setState({
                dataIng9: res.totalIn,
                dataEgr9: res.totalEg
              });
              break;
            case 10:
              this.setState({
                dataIng10: res.totalIn,
                dataEgr10: res.totalEg
              });
              break;
            case 11:
              this.setState({
                dataIng11: res.totalIn,
                dataEgr11: res.totalEg
              });
              break;
            case 12:
              this.setState({
                dataIng12: res.totalIn,
                dataEgr12: res.totalEg
              });
              break;
          }

        });

      }

    }

  }

  componentDidMount() {
    this.cargarDatos();
  }

  componentDidUpdate(prevProps) {
    // Uso tipico (no olvides de comparar las props):
    if (this.props.data !== prevProps.data) {
      this.cargarDatos();
    }
  }

  render() {
    return (
      <div>
        <Bar
          data={{
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            datasets: [
              {
                label: 'Ingresos',
                // data: this.state.data,
                data: [this.state.dataIng1, this.state.dataIng2, this.state.dataIng3, this.state.dataIng4, this.state.dataIng5, this.state.dataIng6, this.state.dataIng7, this.state.dataIng8, this.state.dataIng9, this.state.dataIng10, this.state.dataIng11, this.state.dataIng12,],
                backgroundColor: [
                  'rgba(75, 192, 192, 1)',
                ],
                borderColor: [
                  'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
                borderRadius: 20,
              },
              {
                label: 'Egresos',
                // data: this.state.data,
                data: [this.state.dataEgr1, this.state.dataEgr2, this.state.dataEgr3, this.state.dataEgr4, this.state.dataEgr5, this.state.dataEgr6, this.state.dataEgr7, this.state.dataEgr8, this.state.dataEgr9, this.state.dataEgr10, this.state.dataEgr11, this.state.dataEgr12,],
                backgroundColor: [
                  'rgba(255, 99, 132, 1)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
                borderRadius: 20,
              },
            ],
          }}
          height={600}
          width={400}

          options={{
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
            legend: {
              labels: {
                fontSize: 25,
              },
            },
          }}
        ></Bar>
      </div>
    );

  }
}
