import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import cache from '@/common/utils/cache'
import playMode from '@/common/utils/playMode'

Vue.use(Vuex);

const state = {
    audio: {
        ele: null, // 元素
        data: null, // 音乐数据
        play: false, // 播放状态
        duration: 0, // 总时长
        currentTime: 0 // 当前秒数
    },
    playMode: playMode.default.value, // 播放模式
    playList: [] // 播放列表
};

const getters = {
    // audio 当前百分比的播放进度
    audio_progress: state => {
        return (state.audio.currentTime / state.audio.duration * 100).toFixed(2) + '%';
    }
};

const mutations = {
    SET_AUDIO_ELE(state, val) {
        state.audio.ele = val
    },
    SET_AUDIO_DATA(state, val) {
        state.audio.data = val;
        // 判断是否添加到播放列表
        const isHas = state.playList.find(n => n.sound.id === val.sound.id);
        if (!isHas) {
            state.playList.unshift(val)
        }
        // 判断是否跳更新详情页 (当前是详情页则进行replace)
        if (router.history.current.name === 'detail' && !router.history.current.query.id === val.sound.id) {
            router.replace({name: 'detail', query: {'id': val.sound.id }})
        }
    },
    SET_AUDIO_PLAY(state, val) {
        state.audio.play = val
    },
    SET_AUDIO_DURATION(state, val) {
        state.audio.duration = val
    },
    SET_AUDIO_CURRENT_TIME(state, val) {
        state.audio.currentTime = val
    },
    SET_PLAY_MODE(state, val) {
        state.playMode = val;
        cache.setSession('playMode', val)
    },
    SET_PLAY_LIST(state, val) {
        // 不直接等於是解決數組引用問題
        state.playList = val.slice();
        cache.setSession('playList', val)

    }
};

const actions = {
    // 获取应用缓存
    INIT_APP_CACHE({ commit }) {
        let playMode = cache.getSession('playMode');
        let playList = JSON.parse(cache.getSession('playList'));
        if (playMode) {
            commit('SET_PLAY_MODE', playMode)
        }
        if (playList && playList.length > 0) {
            commit('SET_PLAY_LIST', playList)
        }
    }
};

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})

