export default function makeInitial(fname, lname) {
    const first = Array.from(fname).shift()
    const last = Array.from(lname).shift()
    const initials = `${first}${last}`
    // debugger

    return initials
}