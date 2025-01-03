export interface IDBConfig {
  name: string
  version?: number
  stores?: { [storeName: string]: string | IDBObjectStoreParameters }
}

class IndexedDBToolkit {
  private dbPromise: Promise<IDBDatabase>

  constructor(private config: IDBConfig) {
    this.dbPromise = this.open()
  }

  /**
   * 打开数据库并创建对象存储（如果不存在）
   * @returns 解析为IDBDatabase实例的promise
   */
  private async open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.name, this.config.version)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (this.config.stores) {
          for (const [name, options] of Object.entries(this.config.stores)) {
            if (!db.objectStoreNames.contains(name)) {
              db.createObjectStore(name, typeof options === 'string' ? { keyPath: options } : options)
            }
          }
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 等待数据库打开
   * @returns 解析为void的promise
   */
  public async ready(): Promise<void> {
    await this.dbPromise
  }

  /**
   * 获取对象存储
   * @param name 对象存储名称
   * @param mode 事务模式，默认为readonly
   * @returns 解析为IDBObjectStore实例的promise
   */
  public async getObjectStore(name: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    const db = await this.dbPromise
    return db.transaction([name], mode).objectStore(name)
  }

  /**
   * 添加数据到对象存储
   * @param storeName 对象存储名称
   * @param data 要添加的数据
   * @returns 解析为IDBValidKey的promise
   */
  public async add<T>(storeName: string, data: T): Promise<IDBValidKey> {
    const store = await this.getObjectStore(storeName, 'readwrite')
    return new Promise((resolve, reject) => {
      const request = store.add(data)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 从对象存储中获取数据
   * @param storeName 对象存储名称
   * @param key 要获取的数据的键
   * @returns 解析为数据的promise
   */
  public async get<T>(storeName: string, key: IDBValidKey): Promise<T> {
    const store = await this.getObjectStore(storeName, 'readonly')
    return new Promise((resolve, reject) => {
      const request = store.get(key)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 更新对象存储中的数据
   * @param storeName 对象存储名称
   * @param data 要更新的数据
   * @returns 解析为void的promise
   */
  public async update<T>(storeName: string, data: T): Promise<void> {
    const store = await this.getObjectStore(storeName, 'readwrite')
    return new Promise((resolve, reject) => {
      const request = store.put(data)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 从对象存储中删除数据
   * @param storeName 对象存储名称
   * @param key 要删除的数据的键
   * @returns 解析为void的promise
   */
  public async delete(storeName: string, key: IDBValidKey): Promise<void> {
    const store = await this.getObjectStore(storeName, 'readwrite')
    return new Promise((resolve, reject) => {
      const request = store.delete(key)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 清空对象存储
   * @param storeName 对象存储名称
   * @returns 解析为void的promise
   */
  public async clear(storeName: string): Promise<void> {
    const store = await this.getObjectStore(storeName, 'readwrite')
    return new Promise((resolve, reject) => {
      const request = store.clear()
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 关闭数据库
   */
  public close(): void {
    this.dbPromise.then((db) => db.close())
  }
}

export function createIndexedDB(options: IDBConfig): IndexedDBToolkit {
  return new IndexedDBToolkit(options)
}
