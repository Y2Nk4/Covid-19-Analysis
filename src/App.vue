<template>
    <div id="app">
        <el-container class="app-container">
            <!--<el-header></el-header>-->
            <el-main>
                <router-view></router-view>
            </el-main>
            <el-footer>Footer</el-footer>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: 'app'
    }
</script>

<style>

</style>
