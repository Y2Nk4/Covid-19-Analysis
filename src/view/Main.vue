<template>
  <div class="main" id="main">
      <el-container class="main-container">
          <el-row :gutter="24" class="main-row">
              <el-col :span="24">
                  <div class="main-title">
                      <el-badge value="USA" class="item" type="tints">
                          <h1 data-text="Covid-19 Big Data Report">
                              Covid-19 Big Data Report
                          </h1>
                      </el-badge>

                      <span> * Data is based on CDC, NYCHealth</span>
                  </div>
              </el-col>

              <el-col :span="24">
                  <el-card class="main-card">
                      <h1 class="section-title">National Report</h1>

                      <el-tabs v-model="CurrentTab" @tab-click="changeTab" class="main-tab">
                          <el-tab-pane label="Glance" name="Glance">
                                <glance-tab></glance-tab>
                          </el-tab-pane>
                          <el-tab-pane label="Increment" name="Increment">

                          </el-tab-pane>
                      </el-tabs>
                  </el-card>
              </el-col>

              <el-col :span="24">
                  <el-card class="main-card">
                      <states-tab></states-tab>
                  </el-card>
              </el-col>
          </el-row>
      </el-container>
  </div>
</template>

<script>
    import '../assets/less/main.less'
    import GlanceTab from './MainTabs/GlanceTab'
    import IncrementTab from './MainTabs/IncrementTab'
    import StatesTab from './MainTabs/StatesTab'

    export default {
        name: 'Main',
        components: {GlanceTab, IncrementTab, StatesTab},

        data () {
            return {
                CurrentTab: 'Glance'
            }
        },

        methods: {
            changeTab () {

            }
        }
    }
</script>

<style scoped>

</style>
