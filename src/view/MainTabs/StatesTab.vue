<template>
    <el-container>
        <el-row class="state-row">
            <el-col :span="24">
                <h1 class="section-title">States Report</h1>
            </el-col>
            <el-col :span="24">
                <el-select v-model="StateSelection" size="small" placeholder="Select State.." class="state-select" type="tints">
                    <el-option
                        v-for="item in States"
                        :key="item.code"
                        :label="item.label"
                        :value="item.code">
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
                                <span class="value">10</span>
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card shadow="always" class="info-card">
                                <span class="title">Total Negative</span>
                                <span class="value">33</span>
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card shadow="always" class="info-card">
                                <span class="title">Total Pending</span>
                                <span class="value">33</span>
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
                StateSelection: null,
                States: [
                    {
                        name: 'New York',
                        code: 'NY'
                    }
                ]
            }
        }
    }
</script>

<style scoped>

</style>
