<template>
    <el-container>
        <el-row class="state-row">
            <el-col :span="24">
                <h1 class="section-title">States Report</h1>
            </el-col>
            <el-col :span="24">
                <el-select v-model="StateSelection" @change="stateOptionChange" size="small" placeholder="Select State.." class="state-select" type="tints">
                    <el-option
                        v-for="item in States"
                        :key="item.code"
                        :label="item.label"
                        :value="item.code"
                    >
                        <span style="float: left" class="state-name">{{ item.name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px" class="state-code">{{ item.code }}</span>
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="24">
                <el-container>
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
                                <span class="title">Total Pending</span>
                                <span class="value"> - </span>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-container>
            </el-col>
        </el-row>
    </el-container>
</template>

<script>
    export default {
        name: 'StatesTab',
        data () {
            return {
                StateSelection: 'NY',
                States: [
                    {
                        name: 'New York',
                        code: 'NY'
                    },
                    {
                        name: 'Washington State',
                        code: 'WA'
                    }
                ],
                summaryData: {
                    currentConfirmed: 0,
                    totalDeath: 0
                }
            }
        },

        methods: {
            stateOptionChange () {
                this.fetchStateInfo(this.StateSelection)
            },
            fetchStateInfo (state) {
                this.$http.get('/api/public/state/summary', {
                    params: {
                        state
                    }
                })
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
            this.fetchStateInfo(this.StateSelection)
        }
    }
</script>

<style scoped>

</style>
