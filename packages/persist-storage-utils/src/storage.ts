export interface StorageConfig extends OtherOptions {
  /** 缓存前缀*/
  prefixKey?: string
  /** 缓存存储对象 localStorage | sessionStorage */
  storage?: Storage
}

interface OtherOptions {
  /** 默认缓存期限 单位毫秒*/
  DEFAULT_CACHE_TIME?: number
}


/** 默认配置 */
const defaultOptions: Required<StorageConfig> = {
  storage: localStorage,
  prefixKey: '',
  DEFAULT_CACHE_TIME: 60 * 60 * 24 * 7,
}

/**
 * 缓存类
 * @param options {StorageConfig} 配置
 */
class StorageTool {
  private options: Required<StorageConfig>;

  constructor(options?: StorageConfig) {
    this.options = { ...defaultOptions, ...options }
  }


  private getKey(key: string) {
    return `${this.options.prefixKey}${key}`.toUpperCase()
  }


  /**
   * @description 设置缓存
   * @param {string} key 缓存键
   * @param {*} value 缓存值
   * @param expire
   */
  set(key: string, value: any, expire: number | null = this.options.DEFAULT_CACHE_TIME) {
    const stringData = JSON.stringify({
      value,
      expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
    })
    this.options.storage.setItem(this.getKey(key), stringData)
  }

  /**
   * 读取缓存
   * @param {string} key 缓存键
   * @param {*=} def 默认值
   */
  get(key: string, def: any = null) {
    const item = this.options.storage.getItem(this.getKey(key))
    if (item) {
      try {
        const data = JSON.parse(item)
        const { value, expire } = data
        // 在有效期内直接返回
        if (expire === null || expire >= Date.now()) {
          return value
        }
        this.remove(key)
      } catch (e) {
        return def
      }
    }
    return def
  }

  /**
   * 从缓存删除某项
   * @param {string} key
   */
  remove(key: string) {
    this.options.storage.removeItem(this.getKey(key))
  }

  /**
   * 清空所有缓存
   * @memberOf Cache
   */
  clear(): void {
    this.options.storage.clear()
  }

  /**
   * 设置cookie
   * @param {string} name cookie 名称
   * @param {*} value cookie 值
   * @param {number=} expire 过期时间
   * 如果过期时间为设置，默认关闭浏览器自动删除
   * @example
   */
  setCookie(name: string, value: any, expire: number | null = this.options.DEFAULT_CACHE_TIME) {
    document.cookie = `${this.getKey(name)}=${value}; Max-Age=${expire}`
  }

  /**
   * 根据名字获取cookie值
   * @param name
   */
  getCookie(name: string): string {
    const cookieArr = document.cookie.split('; ')
    for (let i = 0, length = cookieArr.length; i < length; i++) {
      const kv = cookieArr[i].split('=')
      if (kv[0] === this.getKey(name)) {
        return kv[1]
      }
    }
    return ''
  }

  /**
   * 根据名字删除指定的cookie
   * @param {string} key
   */
  removeCookie(key: string) {
    this.setCookie(key, 1, -1)
  }

  /**
   * 清空cookie，使所有cookie失效
   */
  clearCookie(): void {
    const keys = document.cookie.match(/[^ =;]+(?==)/g)
    if (keys) {
      for (let i = keys.length; i--;) {
        document.cookie = `${keys[i]}=0;expire=${new Date(0).toUTCString()}`
      }
    }
  }
}




/**
 * 创建缓存实例
 * @param options {StorageConfig} 配置
 * @returns {Storage} 缓存实例
 * @example
 * import { createStorage } from 'persist-storage-utils'
 * const storage = createStorage({ prefixKey: 'test-' })
 * storage.set('test', 'test')
 * storage.get('test')
 * storage.remove('test')
 * storage.clear()
 * storage.setCookie('test', 'test')
 * storage.getCookie('test')
 * storage.removeCookie('test')
 * storage.clearCookie()
 */
export function createStorage(options?: StorageConfig) {
  return new StorageTool(options)
}
