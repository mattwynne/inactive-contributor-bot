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
exports.OctokitGitHub = void 0;
const events_1 = require("events");
const OutputTracker_1 = require("./OutputTracker");
const CHANGE_EVENT = 'changeEvent';
class OctokitGitHub {
    constructor(octokit, org) {
        this.octokit = octokit;
        this.org = org;
        this.emitter = new events_1.EventEmitter();
    }
    static createNull(options = {}) {
        return new OctokitGitHub(new NullOctokit(Object.assign(Object.assign({}, defaultOptions), options)), 'an-org');
    }
    static create(octokit, org) {
        return new OctokitGitHub(octokit, org);
    }
    hasCommittedSince(author, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.octokit.rest.repos.listForOrg({ org: this.org });
            const repos = response.data.map((repoData) => repoData.name);
            for (const repo of repos) {
                const result = yield this.octokit.rest.repos.listCommits({
                    owner: this.org,
                    repo,
                    author,
                    since: date.toISOString(),
                });
                if (result.data.length > 0) {
                    return true;
                }
            }
            return false;
        });
    }
    addUserToTeam(user, team) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.octokit.rest.teams.addOrUpdateMembershipForUserInOrg({
                org: this.org,
                team_slug: team,
                username: user,
            });
            this.emitter.emit(CHANGE_EVENT, {
                action: 'add',
                team,
                user,
            });
        });
    }
    removeUserFromTeam(user, team) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.octokit.rest.teams.removeMembershipForUserInOrg({
                org: this.org,
                team_slug: team,
                username: user,
            });
            this.emitter.emit(CHANGE_EVENT, {
                action: 'remove',
                team,
                user,
            });
        });
    }
    getMembersOf(team) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.octokit.rest.teams.listMembersInOrg({
                org: this.org,
                team_slug: team,
            });
            return result.data.map((user) => user.login);
        });
    }
    trackChanges() {
        return OutputTracker_1.OutputTracker.create(this.emitter, CHANGE_EVENT);
    }
}
exports.OctokitGitHub = OctokitGitHub;
const defaultTeamMembers = [];
const defaultHasCommitted = false;
const defaultOptions = {
    teamMembers: [defaultTeamMembers],
    hasCommitted: [defaultHasCommitted],
};
class NullOctokit {
    constructor(options) {
        this.options = options;
    }
    get rest() {
        return {
            teams: {
                addOrUpdateMembershipForUserInOrg() {
                    return Promise.resolve();
                },
                removeMembershipForUserInOrg() {
                    return Promise.resolve();
                },
                listMembersInOrg: () => {
                    const teamMembers = (this.options.teamMembers || []).shift() || defaultTeamMembers;
                    return Promise.resolve(new NullMembersList(teamMembers));
                },
            },
            repos: {
                listForOrg() {
                    return Promise.resolve(new NullRepoList());
                },
                listCommits: () => {
                    const hasCommitted = (this.options.hasCommitted || []).shift() || defaultHasCommitted;
                    return Promise.resolve(new NullCommitList(hasCommitted));
                },
            },
        };
    }
}
class NullRepoList {
    get data() {
        return [
            {
                name: 'null_octokit_repo',
            },
        ];
    }
}
class NullCommitList {
    constructor(hasCommitted) {
        this.hasCommitted = hasCommitted;
    }
    get data() {
        return this.hasCommitted ? ['null_octokit_commit'] : [];
    }
}
class NullMembersList {
    constructor(teamMembers) {
        this.teamMembers = teamMembers;
    }
    get data() {
        return this.teamMembers.map((login) => ({ login }));
    }
}
