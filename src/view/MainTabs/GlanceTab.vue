<template>
    <el-container class="glance-tab main-tab-items">
        <el-row :gutter="24" class="main-row">
            <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                <el-card shadow="always" class="info-card">
                    <span class="title">Total Cases</span>
                    <span class="value">{{ summaryData.currentConfirmed }}</span>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                <el-card shadow="always" class="info-card">
                    <span class="title">Total Deaths</span>
                    <span class="value">{{ summaryData.totalDeath }}</span>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                <el-card shadow="always" class="info-card">
                    <span class="title">Jurisdictions Reporting</span>
                    <span class="value">{{ summaryData.statesReportingCases }}</span>
                </el-card>
            </el-col>
            <el-col :span="24">
                <span class="note">* Important Note: This data is collected from <a href="https://www.cdc.gov/coronavirus/2019-ncov/cases-in-us.html" target="_blank">CDC</a>'s official website. Due to CDC's update delay, this data may be incorrect!</span>
            </el-col>

            <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <v-chart :options="totalCaseOptions" class="fullscreen-graph"></v-chart>
                <span class="note">* Important Note: We began to collect data since Mar 3rd, 2020</span>
            </el-col>

            <el-col :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <v-chart :options="caseStructOptions" class="fullscreen-graph"></v-chart>
            </el-col>
        </el-row>
    </el-container>
</template>

<script>
    export default {
        name: 'GlanceTab',

        data () {
            return {
                summaryData: {
                    currentConfirmed: 0,
                    totalDeath: 0,
                    statesReportingCases: 0
                },

                totalCaseOptions: {
                    title: {
                        text: 'Covid-19',
                        left: 'center'
                    },
                    xAxis: {
                        type: 'time',
                        splitLine: {
                            show: false
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: ['rgba(221,221,221,0.5)'],
                                type: 'dashed'
                            }
                        }
                    },
                    series: [{
                        data: [],
                        type: 'line',
                        smooth: true
                    }]
                },

                caseStructOptions: {
                    title: {
                        text: null,
                        left: 'center',
                        subtextStyle: {
                            frontSize: 11
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 10,
                        bottom: 10,
                        data: []
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: 80,
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'bottom',
                                    fontSize: '15'
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        fontSize: '20',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: []
                        }
                    ]
                }
            }
        },

        methods: {
            async getSummary () {
                this.$http.get('/api/public/national/summary')
                .then((res) => {
                    if (res.data.success) {
                        this.summaryData = res.data.data
                    } else {
                        this.$notify.error({
                            title: 'Error',
                            message: 'Error occurred while fetching data from our server'
                        })
                    }
                })
            },

            async getSummaryGraph () {
                this.$http.get('/api/public/national/graph/summary', {
                    params: {
                        type: 1
                    }
                })
                .then((res) => {
                    if (res.data.success) {
                        this.totalCaseOptions.title.text = res.data.data.title
                        this.totalCaseOptions.series[0].data = res.data.data.graphData
                    } else {
                        this.$notify.error({
                            title: 'Error',
                            message: 'Error occurred while fetching data from our server'
                        })
                    }
                })
            },

            async getCaseStructGraph () {
                this.$http.get('/api/public/national/graph/caseStructureAnalysis')
                .then((res) => {
                    if (res.data.success) {
                        this.caseStructOptions.title.text = res.data.data.title
                        this.caseStructOptions.title.subtext = res.data.data.subtitle
                        this.caseStructOptions.legend.data = res.data.data.legend
                        this.caseStructOptions.series[0].name = res.data.data.title
                        this.caseStructOptions.series[0].data = res.data.data.graphData
                    } else {
                        this.$notify.error({
                            title: 'Error',
                            message: 'Error occurred while fetching data from our server'
                        })
                    }
                })
            }
        },

        mounted () {
            this.getSummary()
            this.getSummaryGraph()
            this.getCaseStructGraph()
        }
    }
</script>

<style scoped>
    .echarts.fullscreen-graph {
        width: 100%;
        height: 300px;
    }
    .echarts.halfscreen-graph {
        width: 50%;
    }
</style>
