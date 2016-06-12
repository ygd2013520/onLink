import pika
import json
from fs.btrfs import (scan_disks, wipe_disk, blink_disk, enable_quota,
											btrfs_uuid, pool_usage, mount_root, get_pool_info,
											pool_raid, enable_quota)

MIN_DISK_SIZE = 1024 * 1024

listenKeys = ['storage'];
ex = 'service';

connection = pika.BlockingConnection(pika.ConnectionParameters(
	host='localhost'))
channel = connection.channel()

channel.exchange_declare(exchange=ex,
												 type='topic',
												 durable=True)

result = channel.queue_declare(exclusive=True)
queue_name = result.method.queue

for key in listenKeys:
	channel.queue_bind(exchange=ex,
										 queue=queue_name,
										 routing_key=key)

print(' [*] Waiting for logs. To exit press CTRL+C')


def callback(ch, method, properties, body):
	print(" [x] %r:%r:%r" % (method.routing_key, properties, body));
	bodyJson = json.loads(bytes.decode(body));

	data = scan_disks(MIN_DISK_SIZE);
	response = {};
	response['status'] = 200;
	# response['content'] = bodyJson;
	if (method.routing_key == "disks"):
		response['content'] = data;
	else:
		response['content'] = bodyJson;

	ch.basic_publish(exchange='',
									 routing_key=properties.reply_to,
									 properties=pika.BasicProperties(
										 correlation_id=properties.correlation_id,
										 delivery_mode=2,  # make message persistent
									 ),
									 body=str(json.dumps(response)))
	ch.basic_ack(delivery_tag=method.delivery_tag)


channel.basic_qos(prefetch_count=1);
channel.basic_consume(callback, queue=queue_name, no_ack=False)

channel.start_consuming()
