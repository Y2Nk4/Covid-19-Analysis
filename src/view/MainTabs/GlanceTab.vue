<template>
    <el-container class="glance-tab main-tab-items">
        <el-row :gutter="24" class="main-row">
            <el-col :span="8">
                <el-card shadow="always" class="info-card">
                    <span class="title">Total Cases</span>
                    <span class="value">{{ summaryData.currentConfirmed }}</span>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="always" class="info-card">
                    <span class="title">Total Deaths</span>
                    <span class="value">{{ summaryData.totalDeath }}</span>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="always" class="info-card">
                    <span class="title">States Reporting</span>
                    <span class="value">{{ summaryData.statesReportingCases }}</span>
                </el-card>
            </el-col>
            <el-col :span="24">
                <span class="note">* Important Note: This data is collected from <a href="https://www.cdc.gov/coronavirus/2019-ncov/cases-in-us.html" target="_blank">CDC</a>'s official website. Due to CDC's update delay, this data may be incorrect!</span>
            </el-col>

            <el-col :span="24">
                <v-chart :options="totalCaseOptions"></v-chart>
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
                        text: 'Covid-19'
                    },
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line',
                        smooth: true
                    }]
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
            }
        },

        mounted () {
            this.getSummary()
        }
    }
</script>

<style scoped>
    .echarts {
        width: 100%;
        height: 300px;
    }
</style>
