export default function (source) {
  console.log('jsonLoader', source)
  // 对资源应用一些转换……
  return `export default ${JSON.stringify(source)}`;
}