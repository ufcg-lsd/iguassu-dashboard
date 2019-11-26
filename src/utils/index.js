function wait(ms) {
  return x => {
    return new Promise(resolve => setTimeout(() => resolve(x), ms));
  };
}

function generateJobStateColor(jobState) {
  switch (jobState) {
    case "WAITING":
      return "blue-grey darken-1";
    case "SUBMITTED":
      return "light-blue darken-2";
    case "CREATED":
      return "purple";
    case "QUEUED":
      return "indigo darken-3";
    case "RUNNING":
      return "orange";
    case "FAILED":
      return "red";
    case "FINISHED":
      return "green";
    default:
      return "primary";
  }
}

function generateTaskStateColor(taskState) {
  switch (taskState) {
    case "PENDING":
      return "yellow";
    case "RUNNING":
      return "orange";
    case "FAILED":
      return "red";
    case "FINISHED":
      return "green";
    default:
      return "primary";
  }
}

function generateCommandStateColor(commandState) {
  switch (commandState) {
    case "RUNNING":
      return "orange";
    case "FAILED":
      return "red";
    case "FINISHED":
      return "green";
    default:
      return "primary";
  }
}

export {
  wait,
  generateJobStateColor,
  generateTaskStateColor,
  generateCommandStateColor
};
