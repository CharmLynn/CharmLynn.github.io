###前言
从spark 2.2开始推出structer streming作为实时计算工具


### 一个Structer streaming项目的开发步骤
####1、创建spark程序入口

```
val spark = SparkSession
  .builder()
  .appName("RedPacketFlow")
  .master("local[2]")
  .getOrCreate()

spark.sparkContext.setLogLevel("WARN")
import spark.implicits._

```

####2、获取kafka的数据源
```
val kafkaSoucer = spark
  .readStream
  .format("kafka")
  .option("kafka.bootstrap.servers",KafkaConfiguration.KAFKA_SERVERS)
  .option("subscribe",KafkaConfiguration.KAFKA_TRANSACTION_TOPIC)
  .option("startingOffsets",KafkaConfiguration.KAFKA_TRANSACTION_STARTING_OFFSETS)
  .load
```
其中option参数一些注释：

**kafka.bootstrap.servers   kafka引导服务器配置**
 
新版本kafka不中，消费者不再直接跟zookeeper消费，而是给几个引导服务器，自动发现其他broker	

**subscribe  订阅主题**		
多个主题通过逗号(,)分割 例如 “topic1,topic2”
支持正则表达式多个主题  例如 “topic*”

**startingOffsets  查询开始时的起点，最早(earliest)和最新(latest)**




####3、从数据源中select出所需要的数据，转化成DataSet[Transaction]类型
    val TransactionDf = kafkaSoucer.select(
      from_json($"value".cast("string"), KafkaConfiguration.TRANSACTION_SCHEMA) as "transaction"
    ).select(
      "transaction.data.createtime",
      "transaction.data.payment",
      "transaction.data.status",
      "transaction.data.updatetime",
      "transaction.data.money",
      "transaction.data.id"
    ).na.drop("any", Array("status", "payment", "id", "money"))
      .filter(($"status" === 4) and ($"payment" === 1100))
      .as[Transaction]
										










