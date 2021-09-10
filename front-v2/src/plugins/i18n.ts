import { createI18n } from 'vue-i18n'

import en from '../locales/en.json'
import sp from '../locales/sp.json'
import kr from '../locales/kr.json'
import fr from '../locales/fr.json'
import zh_cn from '../locales/zh_cn.json'

export default createI18n({
  locale: 'zh_cn',
  fallbackLocale: 'zh_cn',
  messages: {
    en,
    kr,
    fr,
    sp,
    zh_cn,
  },
})
