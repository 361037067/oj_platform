<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> {{$t('common.module.module')}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <el-row>
                <el-col :span="10">
                  <el-input v-model="select_word" :placeholder="$t('message.module.phSearch')" class="handle-input mr10"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" icon="search" @click="search">{{$t('common.module.search')}}</el-button>
                </el-col>
                <el-col :span="3" :offset="7">
                  <el-button v-if="permission === 3 || permission === 2" type="danger" @click="handleAdd">{{$t('common.module.modulePublish')}}</el-button>
                </el-col>
              </el-row>
            </div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <template v-if="permission !== 1" >
                <el-tab-pane label="My req." name="recruiting"></el-tab-pane>
              </template>
              <template v-else>
                <el-tab-pane label="My Work" name="stuWork"></el-tab-pane>
              </template>
              <el-tab-pane label="All req." name="public"></el-tab-pane>
              <template v-if="permission !== 1" >
                <el-tab-pane label="Unpublished" name="private"></el-tab-pane>
              </template>
              <el-tab-pane label="Completed" name="done"></el-tab-pane>
            </el-tabs>
              <el-table :data="data" border ref="multipleTable" stripe empty-text="No Data">
                <el-table-column prop="id" :label="$t('common.module.moduleId')" width="50" align="center"></el-table-column>
                <el-table-column prop="moduleTitle" :label="$t('common.module.moduleTitle')" header-align="center" show-overflow-tooltip effect="light" width="200"></el-table-column>
                <el-table-column prop="moduleLeaderName" :label="$t('common.module.moduleLeaderName')" header-align="center" width="150"></el-table-column>
                <el-table-column prop="duration" :label="$t('common.module.duration')" align="center" width="100">1</el-table-column>
                <el-table-column prop="moduleWeek" :label="$t('common.module.moduleWeekCut')" align="center" width="60" ></el-table-column>
                <el-table-column prop="classHour" :label="$t('common.module.classHour')" header-align="center" show-overflow-tooltip effect="light" width="144" ></el-table-column>
                <el-table-column prop="taNum" :label="$t('common.module.taNumCut')" align="center" width="70" ></el-table-column>
                <el-table-column prop="markerNum" :label="$t('common.module.markerNumCut')" align="center" width="70" ></el-table-column>
                <el-table-column :label="$t('common.module.operate')" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status === 'finish'">The module has finished.</template>
                        <template v-else-if="permission === 1">
                          <template v-if="activeName === 'stuWork'">
                            <span>Your application has been accepted.</span>
                            <el-button  size="mini" type="success" plain @click="handleApply(scope.$index, scope.row)">{{$t('common.module.checkDetails')}}</el-button>
                          </template>
                          <template v-else>
                            <el-button  size="mini" type="warning" plain @click="handleApply(scope.$index, scope.row)">{{$t('common.module.applyFor')}}</el-button>
                          </template>
                        </template>
                        <!-- 如果是管理员或该课程创建者 -->
                        <template v-else-if="permission === 3 || isMyModule(scope.row.moduleLeaderId)" >
                          <template v-if="scope.row.status === 'private'">
                            <el-button size="mini" type="warning" plain @click="handleEdit(scope.$index, scope.row)">{{$t('common.module.editPublish')}}</el-button>
                          </template>
                          <template v-if="scope.row.status === 'public'">
                            <el-tooltip class="item" effect="dark" :content="$t('common.module.editBtn')" placement="bottom-start">
                              <el-button size="mini" type="warning" icon="el-icon-edit" plain @click="handleEdit(scope.$index, scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" :content="$t('common.module.audit')" placement="bottom-start">
                              <el-button size="mini" type="success" icon="el-icon-location" @click="handleAudit(scope.$index, scope.row)"></el-button>
                            </el-tooltip>
                            <!-- 考勤 -->
                            <!-- <el-tooltip class="item" effect="dark" :content="$t('common.module.attendance')" placement="bottom-start">
                              <el-button size="mini" type="primary" icon="el-icon-date" @click="handleAttend(scope.$index, scope.row)"></el-button>
                            </el-tooltip> -->
                          </template>
                          <!-- <template v-if="permission === 3 || (isMyModule(scope.row.moduleLeaderId)  && scope.row.status === 'private')"> 
                          若是管理员或是所有者且状态是私有
                          -->
                          <template v-if="permission === 3 || isMyModule(scope.row.moduleLeaderId)">
                            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></el-button>
                          </template>
                        </template>
                    </template>
                </el-table-column>
              </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="6">
                </el-pagination>
            </div>
        </div>
        <addModule v-if="permission === 3 || permission ===2" :addShow="addShow" @update:addShow="addShow = $event" :row="row"></addModule>
        <editModule v-if="permission === 3 || permission ===2" :editShow="editShow" @update:editShow="editShow = $event" :row="row"></editModule>
        <apply v-if="permission === 1" :applyShow="applyShow" @update:applyShow="applyShow = $event" :row="row"></apply>
        <audit v-if="permission === 3 || permission ===2" :auditShow="auditShow" @update:auditShow="auditShow = $event" :row="row" :confirm="confirm"></audit>
        <attend v-if="permission === 3 || permission ===2" :attendShow="attendShow" @update:attendShow="attendShow = $event" :row="row"></attend>
    </div>
</template>

<script>
export default {
  name: 'module',
  components: {
    'addModule': resolve => { require(['@/components/module/addModule.vue'], resolve) }, // 模块懒加载，防止加载过慢
    'editModule': resolve => { require(['@/components/module/editModule.vue'], resolve) },
    'audit': resolve => { require(['@/components/module/audit.vue'], resolve) },
    'apply': resolve => { require(['@/components/module/apply.vue'], resolve) },
    'attend': resolve => { require(['@/components/module/attend.vue'], resolve) }
  },
  data () {
    return {
      activeName: 'stuWork',
      tableData: [],
      del_list: [],
      cur_page: 1,
      select_word: '',
      is_search: false,
      uId: sessionStorage.getItem('id'),
      permission: JSON.parse(sessionStorage.getItem('permission')).module,
      idx: -1,
      rowCurrent: -1,
      isApply: [],
      isPass: [],
      applyId: [],
      confirm: [],
      row: {},
      editShow: false,
      auditShow: false,
      addShow: false,
      applyShow: false,
      attendShow: false
    }
  },
  created () {
    if (this.permission === undefined) {
      this.$router.push('/personal')
    } else {
      if (this.permission === 1) { // 若是学生用户
        this.getThisStuWork()
      } else {
        this.getMyRecruitingModule()
        this.activeName = 'recruiting'
      }
    }
  },
  computed: {
    data () {
      // console.log(this.select_word)
      return this.tableData.filter((d) => {
        if (d.moduleTitle.indexOf(this.select_word) > -1 ||
                d.moduleLeaderName.indexOf(this.select_word) > -1) {
          return d
        }
      })
    }
  },
  methods: {
    // 分页导航
    handleCurrentChange (val) {
      this.cur_page = val
      this.getAllModule()
    },
    // 获取所有尚在进行中的课程
    getPublicModule () {
      let data = {
        status: 'public'
      }
      this.$api.get('api/v1/modules', data, res => {
        this.tableData = res
        // console.log(res)
      })
    },
    getMyPrivatemodule () {
      let data = {
        status: 'private',
        moduleLeaderId: this.uId
      }
      this.$api.get('api/v1/modules', data, res => {
        this.tableData = res
      }, res => {
        this.tableData = []
      })
    },
    getMyRecruitingModule () {
      if (this.permission !== 1) {
        let data = {
          status: 'public',
          moduleLeaderId: this.uId
        }
        this.$api.get('api/v1/modules', data, res => {
          this.tableData = res
        }, res => {
          this.tableData = []
        })
      } else {
        this.tableData = []
        console.log('student')
      }
    },
    getFinishModule () {
      let data = {
        status: 'finish'
      }
      this.$api.get('api/v1/modules', data, res => {
        this.tableData = res
      })
    },
    getThisStuWork () {
      let data = {
        // spec 并不是某个数据库字段，在此表示该组数据需要特别处理
        spec: true,
        uId: this.uId
      }
      this.$api.get('api/v1/modules', data, res => {
        this.tableData = res
      }, res => {
        this.tableData = []
      })
    },
    handleClick (tab) {
      if (tab.name === 'private') {
        this.getMyPrivatemodule()
      } else if (tab.name === 'done') {
        this.getFinishModule()
      } else if (tab.name === 'recruiting') {
        this.getMyRecruitingModule()
      } else if (tab.name === 'stuWork') {
        this.getThisStuWork()
      } else {
        this.getPublicModule()
      }
    },
    isMyModule (leaderId) {
      if (leaderId === parseInt(this.uId)) {
        return true
      }
      return false
    },
    search () {
      this.is_search = true
    },
    filterTag (value, row) {
      return row.tag === value
    },
    handleView (index, row) {
      // 应该是vue的处理机制+ js异步的问题，虽然说能获得正确的数据，但是页面渲染和实际情况不同
      // 这里用了一个临时的解决方案，强制页面内容重新渲染，获得了正确的结果
      // 但会有用户莫名的“顿挫感”，有时间的话对于editVisible, isApply等数据，需要重新考虑
      // !! 交互特别丑陋，请尽快修改 ！！
      this.editVisible = false
      this.idx = index
      this.rowCurrent = row
      const item = this.tableData[index]
      this.form = {
        'id': item.id,
        'moduleTitle': item.moduleTitle,
        'moduleLeaderName': item.moduleLeaderName,
        'duration': item.duration,
        'moduleWeek': item.moduleWeek,
        'classHour': item.classHour,
        'taNum': item.taNum,
        'markerNum': item.markerNum
      }
      let data = {
        modId: item.id,
        uId: this.uId
      }
      this.isApply['TA'] = false
      this.isApply['Marker'] = false
      this.$api.get('api/v1/moduleApplyRecords', data, res => {
        // 同一课程，一个学生最多出现两条，分别比对这两条记录
        this.isApply[res[0].type] = true
        this.isPass[res[0].type] = res[0].status
        this.applyId[res[0].type] = res[0].id
        if (res[1] !== undefined) {
          this.isApply[res[1].type] = true
          this.isPass[res[1].type] = res[1].status
          this.applyId[res[1].type] = res[1].id
        }
        // console.log(this.isApply) // isApply 和 实际的不同步，造成出错
        this.editVisible = true
      }, res => {
        this.editVisible = true
      })
    },
    handleEdit (index, row) {
      this.editShow = true
      this.row = row
    },
    handleApply (index, row) {
      this.applyShow = true
      this.row = row
    },
    handleAttend (index, row) {
      this.attendShow = true
      this.row = row
    },
    handleAudit (index, row) {
      // console.log(row.id)
      let data = {
        modId: row.id,
        type: 'TA',
        status: 'pass,assigned'
      }
      let taRes = []
      let markerRes = []
      // 获取pass的TA的数量
      this.$api.get('api/v1/moduleApplyRecords', data, res => {
        // console.log(res)
        // 如果有
        taRes = res
        // 获取pass 的marker数量
        let data = {
          modId: row.id,
          type: 'Marker',
          status: 'pass,assigned'
        }
        this.$api.get('api/v1/moduleApplyRecords', data, res => {
          // console.log(res)
          markerRes = res
          this.confirm['TA'] = taRes.length
          this.confirm['Marker'] = markerRes.length
          this.auditShow = true
          this.row = row
        }, res => {
          markerRes = []
          this.confirm['TA'] = taRes.length
          this.confirm['Marker'] = markerRes.length
          this.auditShow = true
          this.row = row
        })
      }, res => {
        // 如果没取到pass 的TA
        taRes = []
        let data = {
          modId: row.id,
          type: 'Marker',
          status: 'pass,assigned'
        }
        this.$api.get('api/v1/moduleApplyRecords', data, res => {
          // console.log(res)
          markerRes = res
          this.confirm['TA'] = taRes.length
          this.confirm['Marker'] = markerRes.length
          this.auditShow = true
          this.row = row
        }, res => {
          markerRes = []
          this.confirm['TA'] = taRes.length
          this.confirm['Marker'] = markerRes.length
          this.auditShow = true
          this.row = row
        })
      })
    },
    handleAdd () {
      this.addShow = true
    },
    handleDelete (index, row) {
      if (this.student !== null) {
        this.$confirm(this.$t('message.module.confirmDelete'), this.$t('common.module.tips'), {
          confirmButtonText: this.$t('common.module.confirm'),
          cancelButtonText: this.$t('common.module.cancel'),
          type: 'warning'
        }).then(() => {
          let data = {
            '_csrf': this.$cookies.get('csrfToken'),
            params: {
              'id': row.id
            }
          }
          // console.log(data)
          this.$api.delete('api/v1/modules/' + row.id, data, res => {
            let data = {
              '_csrf': this.$cookies.get('csrfToken'),
              params: {
                modId: row.id
              }
            }
            // console.log(data)
            this.$api.delete('api/v1/moduleApplyRecords/' + row.id, data, res => {
              this.$message({
                type: 'success',
                message: this.$t('message.module.moduleDelete')
              })
              this.handleClick(this.activeName)
              // this.$forceUpdate()
            }, res => {
              this.$message({
                type: 'success',
                message: this.$t('message.module.moduleDelete')
              })
              this.handleClick(this.activeName)
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('message.module.deleteCancel')
          })
        })
      }
    }
  }
}
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 430px;
    display: inline-block;
  }
  .del-dialog-cnt{
    font-size: 16px;
    text-align: center
  }

  .container {
    width: 1080px;
  }

  .apply-text {
    font-size: 14px;
    color: #606266;
    line-height: 32px;
  }
  .el-input__inner {
    padding-left: 5px !important;
  }
</style>
