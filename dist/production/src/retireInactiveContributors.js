"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retireInactiveContributors = void 0;
const Today_1 = require("./Today");
function retireInactiveContributors(github, configuration) {
    return __awaiter(this, void 0, void 0, function* () {
        const cutOffDate = Today_1.Today.minus(configuration.maximumAbsenceBeforeRetirement);
        const alumniTeam = 'alumni';
        const committersTeam = 'committers';
        const committersTeamMembers = yield github.getMembersOf(committersTeam);
        for (const author of committersTeamMembers) {
            if (!(yield github.hasCommittedSince(author, cutOffDate))) {
                yield github.addUserToTeam(author, alumniTeam);
                yield github.removeUserFromTeam(author, committersTeam);
            }
        }
    });
}
exports.retireInactiveContributors = retireInactiveContributors;
