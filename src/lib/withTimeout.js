/**
 * Promise를 지정된 ms 안에 끝나지 않으면 timeout error로 reject.
 * 원본 promise는 계속 진행되지만(취소 불가) UI는 더 이상 대기하지 않음.
 */
export function withTimeout(promise, ms = 15000, message = '요청 시간이 초과되었습니다. 다시 시도해주세요.') {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const e = new Error(message);
      e.code = 'TIMEOUT';
      reject(e);
    }, ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
