export interface IPFSCreate {
	contents: string,
	path: string,
	pkey: string,
	skey: string
}
export interface IPFSMultiCreate {
	contents_list: string[],
	path_list: string[],
	pkey_list: string[],
	skey_list: string[]
}
export interface IPFSMove {
	new_path: string,
	old_path: string
}
export interface IPFSRemoveReset {
	path: string
}
export interface IPFSSetPermission {
	address: string,
	path: string
}
