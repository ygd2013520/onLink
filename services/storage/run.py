import pika
import json

from action import (btrfs_disk_scan,btrfs_disk_wipe,btrfs_disk_import,\
										smart_control,btrfs_pool_scan,btrfs_add_pool,\
										btrfs_rem_pool,btrfs_share_scan,btrfs_add_share,\
										btrfs_rem_share)

listenKeys = ['disks','pools','shares','snapshots']
ex = 'service'

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
	# print(" [x] %r:%r:%r" % (method.routing_key, properties, body))
	print("[x]routing_key:%r" % method.routing_key)
	# print("[x]action:%r" % (body.action))
	print body
	response = {}
	response['status'] = 200
	if (method.routing_key == "disks"):
		# if (body["action"] == "scan"):
			data = btrfs_disk_scan()
			response['content'] = data
	elif((method.routing_key == "pools")):
		data = btrfs_pool_scan()
		response['content'] = data
	else:
		bodyJson = json.loads(bytes.decode(body))
		response['content'] = bodyJson


	ch.basic_publish(exchange='',
									 routing_key=properties.reply_to,
									 properties=pika.BasicProperties(
										 correlation_id=properties.correlation_id,
										 delivery_mode=2,  # make message persistent
									 ),
									 body=str(json.dumps(response)))
	ch.basic_ack(delivery_tag=method.delivery_tag)


channel.basic_qos(prefetch_count=1)
channel.basic_consume(callback, queue=queue_name, no_ack=False)
channel.start_consuming()
