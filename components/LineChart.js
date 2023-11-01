import { Line } from "react-chartjs-2";
import { plugin } from '@/constants/plugin'

function LineChart({ chartData }) {
    return (
        <div className="w-full borde h-full">
            {/* <h2 style={{ textAlign: "center" }}>Line Chart</h2> */}
            <Line
                data={chartData}
                width="760px"
                // height="190px"
                options={{
                    plugins: {
                        title: {
                            display: false,
                            text: ""
                        },
                        legend: {
                            display: false
                        }
                    },
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            ticks: {
                                callback: function (value) {
                                    return ""
                                }
                            },
                            grid: {
                                display: false,
                                drawTicks: false
                            },
                            border: {
                                display: false
                              } 
                        },
                        x: {
                            ticks: {
                                callback: function (value) {
                                    return ""
                                }
                            },
                            grid: {
                                display: false,
                                drawTicks: false
                              },
                              border: {
                                display: false
                              }
                        },
                    },
                }}
            />
        </div>
    );
}

export default LineChart;