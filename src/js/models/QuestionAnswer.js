import Answer from './Answer';
import Duration from "./Duration";
import _ from 'lodash';
import General from '../utility/General';
import moment from "moment";

class QuestionAnswer {
    static schema = {
        name: "QuestionAnswer",
        properties: {
            question: "string",
            answers: {type: "list", objectType: "Answer"},
        }
    };

    constructor(question, answers) {
        if (_.isNil(question)) return;
        this.question = question;
        this.answers = answers;
    }

    static newInstance(question, answer) {
        return new QuestionAnswer(question, Answer.newInstances(answer));
    }

    answerAsExportableString() {
        return General.toExportable(this.answerAsString());
    }

    answerAsString(i18n) {
        var str;
        if (this.answers.length === 1) {
            if (moment(this.answers[0].value, "YYYY-MM-DD", true).isValid()) {
                str = General.formatDate(new Date(this.answers[0].value));
                str = i18n ? i18n.t(str, {defaultValue: str}) : str;
            }
            else if (_.isNil(this.answers[0].unit)) {
                str = this.answers[0].value.toString();
                str = i18n ? i18n.t(str, {defaultValue: str}) : str;
            }
            else str = Duration.fromAnswer(this.answers[0]).toString(i18n);
        } else {
            str = this.answers.map((answer) =>
                i18n ? i18n.t(answer.value, {defaultValue: answer.value}) : answer.value
            ).toString();
        }
        return str;
    }
}

export default QuestionAnswer;
