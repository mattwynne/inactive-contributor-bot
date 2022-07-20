import { GitHub } from '@actions/github/lib/utils'
import { Commit, Github } from './retireInactiveContributors'
// "TODO: Implement this using actual API calls to GitHub via Octokit library"

export class OctokitGithub implements Github {
  constructor(
    private readonly octokit: InstanceType<typeof GitHub>,
    private readonly org: string
  ) {}

  getLastCommitBy(user: string): Commit {
    throw new Error('Function not implemented.')
    // TODO: build a request with the pattern: https://api.github.com/repos/{user}/{repo}commits/master
    // Possible suggestion in https://stackoverflow.com/a/61548243/11799079 for get last commit
    // To be implemented.

  }

  addUserToTeam(user: string, alumniTeam: string): void {
    throw new Error('Function not implemented.')
  }

  removeUserFromTeam(user: string, committersTeam: string): void {
    throw new Error('Function not implemented.')
  }

  async getMembersOf(team: string): Promise<string[]> {
    // TODO: change interface to make these functions async (i.e. they need to return Promises)
    const result = await this.octokit.rest.teams.listMembersInOrg({
      org: this.org,
      team_slug: team,
    })

    return result.data.map((user) => user.login)
  }
}
