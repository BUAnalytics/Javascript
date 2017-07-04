export * from './BUError'
export * from './BUAPI'
export * from './BUAccessKey'
export * from './BUID'
export * from './BUDocument'
export * from './BUCollection'
export * from './BUCollectionManager'

export * from './templates/BUDeath'
export * from './templates/BUPerformance'
export * from './templates/BUQuestion'
export * from './templates/BUScore'
export * from './templates/BUScreen'
export * from './templates/BUSession'
export * from './templates/BUTemplate'
export * from './templates/BUUser'

export { BUError as Error } from './BUError'
export { BUAPI as API } from './BUAPI'
export { BUAccessKey as AccessKey } from './BUAccessKey'
export { BUID as ID } from './BUID'
export { BUDocument as Document } from './BUDocument'
export { BUCollection as Collection } from './BUCollection'
export { BUCollectionManager as CollectionManager } from './BUCollectionManager'

export { BUDeath as Death } from './templates/BUDeath'
export { BUPerformance as Performance } from './templates/BUPerformance'
export { BUQuestion as Question } from './templates/BUQuestion'
export { BUScore as Score } from './templates/BUScore'
export { BUScreen as Screen } from './templates/BUScreen'
export { BUSession as Session } from './templates/BUSession'
export { BUTemplate as Template } from './templates/BUTemplate'
export { BUUser as User } from './templates/BUUser'

export const Timestamp = () => { return Math.round((new Date()).getTime() / 1000) }

export type Json = { [ key: string ]: any }