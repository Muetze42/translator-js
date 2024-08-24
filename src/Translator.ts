// noinspection RegExpRedundantEscape,JSUnusedGlobalSymbols

import Str from '~/Str'
import { data_get } from '~/helpers'

interface Dataset {
  props?: any
}

interface Translations {
  [key: string]: string
}

/**
 * This class is derived from the code of the Laravel™ Framework (2024-08-24), wich is subject of
 * the MIT License (https://github.com/laravel/framework?tab=MIT-1-ov-file#readme)
 * Copyright (c) 2011-2024 Laravel Holdings Inc. (https://laravel.com/)
 */
class Translator {
  public prop: string
  public elementId: string
  public dataAttribute: string
  public locale: string | null
  public translations: Translations

  /**
   * Create a new Translator instance.
   */
  public constructor(
    prop: string = 'translations',
    elementId: string = 'app',
    dataAttribute: string = 'page',
    locale: string | null = null,
    translations: Translations | null = null,
    bootstrap: boolean = true
  ) {
    this.prop = prop
    this.elementId = elementId
    this.dataAttribute = dataAttribute
    this.locale = locale
    this.translations = translations ? translations : {}
    if (bootstrap) {
      this.bootstrap()
    }
  }

  /**
   * Bootrap the translations' data.
   */
  public bootstrap() {
    let HtmlElement = document.getElementById(this.elementId)

    if (!HtmlElement) {
      this.logError(' HTMLElement not found', this.elementId)
      return
    }

    let dataset = HtmlElement.dataset[this.dataAttribute]

    if (!dataset) {
      this.logError('data-' + this.dataAttribute + ' not exist on HTMLElement')
      return
    }

    let data = <Dataset>{}

    try {
      data = JSON.parse(dataset)
    } catch (error) {
      this.logError('data-' + this.dataAttribute + ' could not parsed')
    }

    if (!data || !data.props) {
      this.logError('data-' + this.dataAttribute + ' is empty')
      return
    }

    if (!data.props) {
      this.logError('data-' + this.dataAttribute + ' has no props')
      return
    }

    this.translations = data_get(data.props, this.prop)
  }

  /**
   * Translate the given string.
   */
  public trans(key: string, replace: { [key: string | number]: string | number } = {}): string {
    if (this.translations && data_get(this.translations, key)) {
      key = this.translations[key]?.toString()
    } else {
      this.logWarn('Message: Key not found', key)
    }

    return this.makeReplacements(key, replace)
  }

  /**
   * Translates the given message based on a count.
   */
  public trans_choice(
    key: string,
    number: number,
    replace: { [key: string | number]: string | number } = {}
  ): string {
    let line = this.trans(key, replace)

    return this.choose(line, number)
  }

  /**
   * Get the application locale.
   */
  public getLocale(): string | null {
    if (this.locale) {
      return this.locale
    }

    let locale = document.documentElement.lang

    if (!locale) {
      return null
    }

    return locale.replace('-', '_')
  }

  /**
   * Set the translations object.
   */
  public setTranslations(translations: Translations) {
    this.translations = translations
  }

  /**
   * Set the application locale.
   */
  public setLocale(locale: string | null) {
    this.locale = locale
  }

  /**
   * Make the place-holder replacements on a line.
   */
  protected makeReplacements(value: string, replace: { [key: string | number]: string | number } = {}): string {
    Object.keys(replace).forEach(function(search) {
      let replaceString = <string>replace[search]?.toString()

      value = value
        .replace(new RegExp(':' + Str.ucfirst(search), 'g'), Str.ucfirst(replaceString))
        .replace(new RegExp(':' + Str.upper(search), 'g'), Str.upper(replaceString))
        .replace(new RegExp(':' + search, 'g'), replaceString)
    })

    return value
  }

  /**
   * Extract a translation string using inline conditions.
   */
  protected choose(line: string, number: number): string {
    let segments = line.split('|')
    let value = this.extract(segments, number)

    if (value !== null) {
      return value.trim()
    }

    segments = this.stripConditions(segments)
    const pluralIndex = this.getPluralIndex(number)

    if (segments.length === 1 || !segments[pluralIndex]) {
      return segments[0]
    }

    return segments[pluralIndex]
  }

  /**
   * Get the index to use for pluralization.
   *
   * The plural rules are derived from code of the Zend Framework (2010-09-25), which
   * is subject to the new BSD license (https://framework.zend.com/license)
   * Copyright (c) 2005-2010 - Zend Technologies USA Inc. (http://www.zend.com)
   */
  protected getPluralIndex(number: number): number {
    switch (this.getLocale()) {
      case 'az':
      case 'az_AZ':
      case 'bo':
      case 'bo_CN':
      case 'bo_IN':
      case 'dz':
      case 'dz_BT':
      case 'id':
      case 'id_ID':
      case 'ja':
      case 'ja_JP':
      case 'jv':
      case 'ka':
      case 'ka_GE':
      case 'km':
      case 'km_KH':
      case 'kn':
      case 'kn_IN':
      case 'ko':
      case 'ko_KR':
      case 'ms':
      case 'ms_MY':
      case 'th':
      case 'th_TH':
      case 'tr':
      case 'tr_CY':
      case 'tr_TR':
      case 'vi':
      case 'vi_VN':
      case 'zh':
      case 'zh_CN':
      case 'zh_HK':
      case 'zh_SG':
      case 'zh_TW':
        return 0
      case 'af':
      case 'af_ZA':
      case 'bn':
      case 'bn_BD':
      case 'bn_IN':
      case 'bg':
      case 'bg_BG':
      case 'ca':
      case 'ca_AD':
      case 'ca_ES':
      case 'ca_FR':
      case 'ca_IT':
      case 'da':
      case 'da_DK':
      case 'de':
      case 'de_AT':
      case 'de_BE':
      case 'de_CH':
      case 'de_DE':
      case 'de_LI':
      case 'de_LU':
      case 'el':
      case 'el_CY':
      case 'el_GR':
      case 'en':
      case 'en_AG':
      case 'en_AU':
      case 'en_BW':
      case 'en_CA':
      case 'en_DK':
      case 'en_GB':
      case 'en_HK':
      case 'en_IE':
      case 'en_IN':
      case 'en_NG':
      case 'en_NZ':
      case 'en_PH':
      case 'en_SG':
      case 'en_US':
      case 'en_ZA':
      case 'en_ZM':
      case 'en_ZW':
      case 'eo':
      case 'eo_US':
      case 'es':
      case 'es_AR':
      case 'es_BO':
      case 'es_CL':
      case 'es_CO':
      case 'es_CR':
      case 'es_CU':
      case 'es_DO':
      case 'es_EC':
      case 'es_ES':
      case 'es_GT':
      case 'es_HN':
      case 'es_MX':
      case 'es_NI':
      case 'es_PA':
      case 'es_PE':
      case 'es_PR':
      case 'es_PY':
      case 'es_SV':
      case 'es_US':
      case 'es_UY':
      case 'es_VE':
      case 'et':
      case 'et_EE':
      case 'eu':
      case 'eu_ES':
      case 'eu_FR':
      case 'fa':
      case 'fa_IR':
      case 'fi':
      case 'fi_FI':
      case 'fo':
      case 'fo_FO':
      case 'fur':
      case 'fur_IT':
      case 'fy':
      case 'fy_DE':
      case 'fy_NL':
      case 'gl':
      case 'gl_ES':
      case 'gu':
      case 'gu_IN':
      case 'ha':
      case 'ha_NG':
      case 'he':
      case 'he_IL':
      case 'hu':
      case 'hu_HU':
      case 'is':
      case 'is_IS':
      case 'it':
      case 'it_CH':
      case 'it_IT':
      case 'ku':
      case 'ku_TR':
      case 'lb':
      case 'lb_LU':
      case 'ml':
      case 'ml_IN':
      case 'mn':
      case 'mn_MN':
      case 'mr':
      case 'mr_IN':
      case 'nah':
      case 'nb':
      case 'nb_NO':
      case 'ne':
      case 'ne_NP':
      case 'nl':
      case 'nl_AW':
      case 'nl_BE':
      case 'nl_NL':
      case 'nn':
      case 'nn_NO':
      case 'no':
      case 'om':
      case 'om_ET':
      case 'om_KE':
      case 'or':
      case 'or_IN':
      case 'pa':
      case 'pa_IN':
      case 'pa_PK':
      case 'pap':
      case 'pap_AN':
      case 'pap_AW':
      case 'pap_CW':
      case 'ps':
      case 'ps_AF':
      case 'pt':
      case 'pt_BR':
      case 'pt_PT':
      case 'so':
      case 'so_DJ':
      case 'so_ET':
      case 'so_KE':
      case 'so_SO':
      case 'sq':
      case 'sq_AL':
      case 'sq_MK':
      case 'sv':
      case 'sv_FI':
      case 'sv_SE':
      case 'sw':
      case 'sw_KE':
      case 'sw_TZ':
      case 'ta':
      case 'ta_IN':
      case 'ta_LK':
      case 'te':
      case 'te_IN':
      case 'tk':
      case 'tk_TM':
      case 'ur':
      case 'ur_IN':
      case 'ur_PK':
      case 'zu':
      case 'zu_ZA':
        return number === 1 ? 0 : 1
      case 'am':
      case 'am_ET':
      case 'bh':
      case 'fil':
      case 'fil_PH':
      case 'fr':
      case 'fr_BE':
      case 'fr_CA':
      case 'fr_CH':
      case 'fr_FR':
      case 'fr_LU':
      case 'gun':
      case 'hi':
      case 'hi_IN':
      case 'hy':
      case 'hy_AM':
      case 'ln':
      case 'ln_CD':
      case 'mg':
      case 'mg_MG':
      case 'nso':
      case 'nso_ZA':
      case 'ti':
      case 'ti_ER':
      case 'ti_ET':
      case 'wa':
      case 'wa_BE':
      case 'xbr':
        return number === 0 || number === 1 ? 0 : 1
      case 'be':
      case 'be_BY':
      case 'bs':
      case 'bs_BA':
      case 'hr':
      case 'hr_HR':
      case 'ru':
      case 'ru_RU':
      case 'ru_UA':
      case 'sr':
      case 'sr_ME':
      case 'sr_RS':
      case 'uk':
      case 'uk_UA':
        return number % 10 === 1 && number % 100 !== 11
          ? 0
          : number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)
            ? 1
            : 2
      case 'cs':
      case 'cs_CZ':
      case 'sk':
      case 'sk_SK':
        return number === 1 ? 0 : number >= 2 && number <= 4 ? 1 : 2
      case 'ga':
      case 'ga_IE':
        return number === 1 ? 0 : number === 2 ? 1 : 2
      case 'lt':
      case 'lt_LT':
        return number % 10 === 1 && number % 100 !== 11
          ? 0
          : number % 10 >= 2 && (number % 100 < 10 || number % 100 >= 20)
            ? 1
            : 2
      case 'sl':
      case 'sl_SI':
        return number % 100 === 1
          ? 0
          : number % 100 === 2
            ? 1
            : number % 100 === 3 || number % 100 === 4
              ? 2
              : 3
      case 'mk':
      case 'mk_MK':
        return number % 10 === 1 ? 0 : 1
      case 'mt':
      case 'mt_MT':
        return number === 1
          ? 0
          : number === 0 || (number % 100 > 1 && number % 100 < 11)
            ? 1
            : number % 100 > 10 && number % 100 < 20
              ? 2
              : 3
      case 'lv':
      case 'lv_LV':
        return number === 0 ? 0 : number % 10 === 1 && number % 100 !== 11 ? 1 : 2
      case 'pl':
      case 'pl_PL':
        return number === 1
          ? 0
          : number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 12 || number % 100 > 14)
            ? 1
            : 2
      case 'cy':
      case 'cy_GB':
        return number === 1 ? 0 : number === 2 ? 1 : number === 8 || number === 11 ? 2 : 3
      case 'ro':
      case 'ro_RO':
        return number === 1 ? 0 : number === 0 || (number % 100 > 0 && number % 100 < 20) ? 1 : 2
      case 'ar':
      case 'ar_AE':
      case 'ar_BH':
      case 'ar_DZ':
      case 'ar_EG':
      case 'ar_IN':
      case 'ar_IQ':
      case 'ar_JO':
      case 'ar_KW':
      case 'ar_LB':
      case 'ar_LY':
      case 'ar_MA':
      case 'ar_OM':
      case 'ar_QA':
      case 'ar_SA':
      case 'ar_SD':
      case 'ar_SS':
      case 'ar_SY':
      case 'ar_TN':
      case 'ar_YE':
        return number === 0
          ? 0
          : number === 1
            ? 1
            : number === 2
              ? 2
              : number % 100 >= 3 && number % 100 <= 10
                ? 3
                : number % 100 >= 11 && number % 100 <= 99
                  ? 4
                  : 5
      default:
        return 0
    }
  }

  /**
   * Strip the inline conditions from each segment, just leaving the text.
   */
  protected stripConditions(segments: string[]) {
    // eslint-disable-next-line no-useless-escape
    return segments.map((part) => part.replace(/^[\{\[]([^\[\]\{\}]*)[\}\]]/, ''))
  }

  /**
   * Extract a translation string using inline conditions.
   */
  protected extract(segments: string[], number: number): any | null {
    for (const part of segments) {
      let line = this.extractFromString(part, number)

      if (line !== null) {
        return line
      }
    }

    return null
  }

  /**
   * Get the translation string if the condition matches.
   */
  protected extractFromString(part: string, number: number): any | null {
    // eslint-disable-next-line no-useless-escape
    let matches = part.match(/^[\{\[]([^\[\]\{\}]*)[\}\]](.*)/s) || []

    if (matches.length !== 3) {
      return null
    }

    const condition = matches[1]
    const value = matches[2]

    if (condition.includes(',')) {
      let [from, to] = condition.split(',')

      if (to === '*' && number >= parseFloat(from)) {
        return value
      } else if (from === '*' && number <= parseFloat(to)) {
        return value
      } else if (number >= parseFloat(from) && number <= parseFloat(to)) {
        return value
      }
    }

    return parseFloat(condition) === number ? value : null
  }

  /**
   * Output a message to the console at the "error" log level.
   */
  protected logError(...data: any) {
    this.log('error', data)
  }

  /**
   * Output a message to the console at the "warning" log level.
   */
  protected logWarn(...data: any) {
    this.log('warn', data)
  }

  /**
   * Output a message to the console at the "error" log level.
   */
  protected log(level: 'log' | 'error' | 'warn' | 'debug', ...data: any) {
    console[level]('[TRANSLATOR]', ...data)
  }
}

export default Translator
