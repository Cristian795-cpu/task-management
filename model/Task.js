export class Task {
    constructor(titleNote, textNote) {
        this.titleNote = titleNote;
        this.textNote = textNote;
    }

    set setTextNote(textNote) {
        this.textNote = textNote;
    }

    get getTextNote() {
        return this.textNote
    }

    set setTitleNote(titleNote) {
        this.titleNote = titleNote;
    }

    get getTitleNote() {
        return this.titleNote;
    }

}