<template>
    <el-card>
      <div class="limitPosition">
        <div class="questHead">
          <span>[ {{ index + 1 }} ]</span>
          <span>{{ title }}</span>
        </div>
        <div>
        <el-radio-group v-model="stuAnswer">
          <div v-for='(option, optIndex) in options' > <!-- :key="index"> -->
            <div v-if="option != null">
              <el-radio :label="optList[optIndex]" >
                {{ optList[optIndex] }}<div class="optText">{{ option }}</div>
              </el-radio>
            </div>
          </div>
        </el-radio-group>
        <i class='el-icon-check' :class="rightIcon"></i>
        <i class='el-icon-close' :class="wrongIcon"></i>
        </div>
      </div>
    </el-card>
</template>
<script>
export default {
  props: ['quest', 'index', 'answer'],
  data () {
    return {
      optList: ['A', 'B', 'C', 'D', 'E', 'F'],
      title: this.quest.quest_Title,
      stuAnswer: '',
      options: [],
      rightIcon: 'hidden',
      wrongIcon: 'hidden'
    }
  },
  methods: {
  },
  created () {
    // console.log(this.answer)
    this.options = [this.quest.quest_A, this.quest.quest_B, this.quest.quest_C, this.quest.quest_D, this.quest.quest_E, this.quest.quest_F]
    this.stuAnswer = this.answer
  },
  watch: {
    // 前端收到答案时的处理
    stuAnswer: function () {
      // 如果和之前给的答案不一样
      if (this.answer !== this.stuAnswer) {
        this.$emit('update:answer', this.stuAnswer)
        // console.log('update')
      }
      if (this.stuAnswer !== 0) {
        if (this.stuAnswer === this.quest.quest_Answer) {
          this.rightIcon = ''
          this.wrongIcon = 'hidden'
        } else {
          this.wrongIcon = ''
          this.rightIcon = 'hidden'
        }
      }
    }
  }
}
</script>

<style scoped lang="css">
.el-radio-group {
  display: inline-block;
  max-width: 85%;
  padding-left: 40px;
}

.questHead{
  max-width: 90%;
  display: inline-block;
  margin-bottom: 0.8em;
  font-size: 1.3em;
  font-weight: 700;
  padding-left: 1.5em;
}

.optText{
  font-size: 1.3em;
  margin: 0.5em 1em 0.5em 0.8em;
  word-break: break-word;
  white-space: normal;
  display:inline-block;
}
.el-icon-check, .el-icon-close {
  margin-right: 1em;
  position: absolute;
  bottom: 0px;
  right: 0px;
  font-size: 100px;
  font-weight: 700;
}
.limitPosition {
  position: relative;
}
.el-icon-check {
  color: #67C23A;
}
 .el-icon-close{
  color: #F56C6C;
}
.hidden {
  display: none;
}
</style>
