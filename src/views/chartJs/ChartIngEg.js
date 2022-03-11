import React from 'react';
import { Bar } from 'react-chartjs-2';
import * as FirestoreService from './services/firestore';
import ChartDataLabels from 'chartjs-plugin-datalabels'

export class BarChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [0, 0]
        };
    }

    cargarDatos() {
        if (this.props.data !== undefined) {
            FirestoreService.getTotInEgAll(this.props.data).then((res) => {
                this.setState({
                    data: [res.totalIn, res.totalEg]
                })
            });
        }

    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.cargarDatos();
        }
    }

    render() {
        return (
            <div>
                <Bar
                    data={{
                        labels: ['Ingresos', 'Egresos'],
                        datasets: [
                            {
                                //if u want to show one bar per group, u must pass one of the 2 values as 0
                                data: [this.state.data[0],this.state.data[1]],
                                backgroundColor: [
                                    'rgba(75, 192, 192, 1)','rgba(255, 99, 132, 1)'
                                ],
                                borderColor: [
                                    'rgba(75, 192, 192, 1)','rgba(255, 99, 132, 1)'
                                ],
                                borderWidth: 1,
                                borderRadius: 20,
                            },
                            /* {
                                label: 'Egresos',
                                data: [0,this.state.data[1]],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 1)',
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                ],
                                borderWidth: 1,
                                borderRadius: 20,
                            } */
                        ],
                    }}
                    height={600}
                    width={400}
                    options={{
                        maintainAspectRatio: false,
                        
                        scales: {
                          yAxes: [{
                            ticks: {
                              max: this.props.maxY,
                              min: 0,
                              stepSize: 50,
                              display: false
                            },
                          }],
                        },
                        
                        plugins: {
                          datalabels: {
                            anchor: 'end',
                            align: 'top',
                            color: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)']
                          },
                          tooltip: {
                            enabled: true
                          },
                          legend: {
                            display: false
                          },
                        }
                      }}
                ></Bar>
            </div>
        );

    }
}