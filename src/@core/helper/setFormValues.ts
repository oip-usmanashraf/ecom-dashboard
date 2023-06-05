export const setFormValues = <ObjKeys, ObjApi>(entity: ObjApi, setValue: (key: ObjKeys, value: string) => void) => {
    // @ts-ignore
    Object.keys(entity).forEach((key, value) => {
        // @ts-ignore
        setValue(key, entity[key])
    })
}