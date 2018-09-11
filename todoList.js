const TASK = require('./task.js');

/**
  * 1. 할일
  * 1-1) 상태 : todo, doing, done
  * 
  * 2. command("명령어")
  * - 공백 제거되고, 대문자가 섞여 있어도 소문자로 변경하여 처리되도록 구현.
  * - 인자에 명령어가 넘어오면 $로 자른다.
  * 
  * 2-1) add
  * - command("add$할일");
  * - add일 경우 할일을 추가한다. 1번째 인덱스 값은 할일이다.
  * - $로 나뉜 0번째 인덱스 값은 소문자로 치환하고 공백을 제거한다.
  * - 할일 추가시 id값을 생성하고 결과를 알려준다. ( default status todo )
  * 
  * 2-2) update
  * - command("update$번호$상태")
  * - update일 경우 상태를 변경한다. 1번째 인덱스는 번호값 2번째 인덱스는 상태값
  * - doing 상태로 변경시 상태 변경시간을 저장하자. ( done 상태까지의 시간 계산 )
  * 
  * 2-3) show
  * - command("show$상태");
  * - show일 경우 상태별 출력을 한다. 1번째 인덱스는 상태값
  */


const SEPARATOR = "$";
const pipeline = (...functions) => args => functions.reduce((arg, nextFn) => nextFn(arg), args);
const splitCommand = (regExp) => (str) => str.split(regExp)[0];
const toLowerCase = (str) => str.toLowerCase();
const trim = (str) => str.trim();
const extractCommand = pipeline(
  splitCommand(SEPARATOR),
  trim,
  toLowerCase,
);

const taskMap = new Map();
const executeCommand = (command, input) => {
  if(command === 'add') addTask(taskMap, input);
  else if(command === 'update') updateStatus(taskMap, input);
  else if(command === 'show') showTaskByStatus(taskMap, input);
}

const addTask = (taskMap, input) => {
  const [, remark] = input.split(SEPARATOR);

  const sequence = taskMap.size + 1;
  const taskObj = {
    taskId: sequence, 
    remark: remark, 
    status : TASK.STATUS.TODO,
    rgstDate: new Date()
  };
  taskMap.set(sequence, taskObj);
  
  showCurrentTaskList(taskMap);
}

const updateStatus = (taskMap, input) => {
  let [, taskId, taskStatus] = input.split(SEPARATOR);
  taskId = Number(taskId);
  if(!taskMap.has(taskId)) return;

  const taskObj = taskMap.get(taskId);
  const status = convertStatus(taskStatus);
  const newTaskObj = Object.assign({}, taskObj, {status: status});
  taskMap.set(taskId, newTaskObj);

  showCurrentTaskList(taskMap);
}

const convertStatus = (status) => {
  if(status === "" && status.length === 0) return;

  return status === "todo" ? 0 : status === "doing" ? 1 : 2
}

const showTaskByStatus = (taskMap, input) => {
  const [, status] = input.split(SEPARATOR);

}

const showCurrentTaskList = (taskMap) => {
  const taskCountList = [0, 0, 0];
  for(let [, value] of taskMap) {
    taskCountList[value.status]++;
  }

  console.log(`현재상태 : todo:${taskCountList[TASK.STATUS.TODO]}개,`
                      + ` doing:${taskCountList[TASK.STATUS.DOING]}개,` 
                      + ` done:${taskCountList[TASK.STATUS.DONE]}개`);
}

const inputCommand = () => {
  const input = "Update  $3$done"
  if(input === '' && input.length === 0) return;
  
  const command = extractCommand(input);
  debugger;
  executeCommand(command, input);
}

inputCommand();



