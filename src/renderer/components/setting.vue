<template>
  <div id="setting">
    <div class="theme-setting">
      <div class="setting-title">
        主题设置
      </div>
      <div class="theme">
        选择主题：
        <el-select v-model="primaryColor"
                   placeholder="请选择"
                   @change="handleSelect">
          <el-option
              v-for="item in themeColors"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            <span style="float: left;">{{ item.label }}</span>
            <span :style="{
                margin: '0.7rem 0',
                float: 'right',
                backgroundColor: item.color,
                width: '6rem',
                height: '2rem'
            }"></span>
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { ipcRenderer } from 'electron';

  export default {
    name: 'setting',
    data() {
      return {
        themeColors: [],
        originalStylesheetCount: -1,
        originalStyle: ''
      };
    },
    computed: {
      primaryColor: {
        get() {
          return this.themeColor.label;
        },
        set(v) {
          this.setThemeColor(v);
        }
      },
      ...mapGetters([
        'themeColor',
        'colors'
      ])
    },
    created() {
      Object.keys(this.colors).forEach((key) => {
        this.themeColors.push({
          label: this.colors[key].label,
          color: this.colors[key].value,
          value: key
        });
      });
    },
    methods: {
      handleSelect() {
        this.$confirm('更换主题成功，重启应用才能生效，是否重启应用？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          ipcRenderer.send('relaunch-app', null);
        }).catch(() => {
        });
      },
      ...mapMutations([
        'setThemeColor'
      ])
    }
  };
</script>

<style lang="scss" scoped>
  #setting {
    padding: 1px;
  }

  .setting-title {
    font-size: 2rem;
    margin: 2rem 0;
  }

  .theme-setting {
    margin: 2rem;
  }
</style>