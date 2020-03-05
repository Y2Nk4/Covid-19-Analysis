<template>
    <el-container class="glance-tab main-tab-items">
        <el-row :gutter="24" class="main-row">
            <el-col :span="8">
                <el-card shadow="always" class="info-card">
                    <span class="title">Total Cases</span>
                    <span class="value">80</span>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="always" class="info-card">
                    <span class="title">Total Pending</span>
                    <span class="value">9</span>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="always" class="info-card">
                    <span class="title">States Reporting</span>
                    <span class="value">13</span>
                </el-card>
            </el-col>
        </el-row>
    </el-container>
</template>

<script>
    export default {
        name: 'GlanceTab'
    }
</script>

<style scoped>

</style>
