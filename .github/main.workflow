workflow "Build and Deploy" {
  on = "push"
  resolves = ["Deploy on Firebase"]
}

action "Install dependencies" {
  uses = "Tgjmjgj/npm@specify-workspace-directory"
  args = "install"
  env = {
    DIR = "./functions"
  }
}

action "Build project" {
  uses = "Tgjmjgj/npm@specify-workspace-directory"
  needs = ["Install dependencies"]
  args = "run build"
  env = {
    DIR = "./functions"
  }
}

action "Run tests" {
  uses = "Tgjmjgj/npm@specify-workspace-directory"
  needs = ["Build project"]
  args = "t"
  env = {
    DIR = "./functions"
  }
}

action "Collect coverage" {
  uses = "Tgjmjgj/npm@specify-workspace-directory"
  needs = ["Build project"]
  args = "run coverage"
  env = {
    DIR = "./functions"
  }
}

action "Send coverage to codecov" {
  uses = "Atrox/codecov-action@v0.1.2"
  needs = ["Collect coverage"]
  secrets = ["CODECOV_TOKEN"]
}

action "Filter master" {
  uses = "actions/bin/filter@master"
  needs = ["Run tests", "Send coverage to codecov"]
  args = "branch (master|debug)"
}

action "Deploy on Firebase" {
  uses = "w9jds/firebase-action@7d6b2b058813e1224cdd4db255b2f163ae4084d3"
  secrets = ["FIREBASE_TOKEN"]
  args = "deploy --only functions"
  needs = ["Filter master"]
}
