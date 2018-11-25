import { CreateEntityTypeRequest, Entity, EntityKind, EntityType, EntityTypesClient, Intent, IntentsClient } from 'dialogflow';

import { DB } from './db';
import { Item } from './models/Item';
import { Parameter } from './models/Parameter';

export namespace Generator {

  const entityTypesClient: EntityTypesClient = new EntityTypesClient();
  const intentsClient: IntentsClient = new IntentsClient();
  const entitiesAgentPath: string = entityTypesClient.projectAgentPath(process.env.DIALOGFLOW_ID);
  const intentsAgentPath: string = intentsClient.projectAgentPath(process.env.DIALOGFLOW_ID);

  async function clearIntents(): Promise<void[]> {
    const responses: object = await intentsClient.listIntents({ parent: intentsAgentPath });
    const promises: Promise<void>[] = responses[0].map(async (intent: Intent) => {
      const entityTypePath: string = intentsClient.intentPath(
        process.env.DIALOGFLOW_ID,
        intent.name.split('/').slice(-1)[0]
      );
      await intentsClient.deleteIntent({
        name: entityTypePath
      });
    });

    return Promise.all(promises);
  }

  async function clearEntities(): Promise<void[]> {
    const responses: object = await entityTypesClient.listEntityTypes({ parent: entitiesAgentPath });
    const promises: Promise<void>[] = responses[0].map(async (entityType: EntityType) => {
      const entityTypePath: string = entityTypesClient.entityTypePath(
        process.env.DIALOGFLOW_ID,
        entityType.name.split('/').slice(-1)[0]
      );
      await entityTypesClient.deleteEntityType({
        name: entityTypePath
      });
    });

    return Promise.all(promises);
  }

  async function createEntity(name: string, entities: Entity[], isList: boolean = false): Promise<void> {
    const createEntityTypeRequest: CreateEntityTypeRequest = {
      parent: entitiesAgentPath,
      entityType: {
        name: undefined,
        displayName: name,
        kind: <EntityKind>((isList) ? 'KIND_LIST' : 'KIND_MAP'),
        entities: entities,
        autoExpansionMode: undefined
      }
    };
    try {
      await entityTypesClient.createEntityType(createEntityTypeRequest);
      console.log(`Created ${name} entity type`);
    } catch (error) {
      console.error(error);
    }
  }

  async function generateEntities(): Promise<void> {
    await clearEntities();

    const items: Item[] = await DB.getItems();
    const params: Parameter[] = await DB.getParameters();

    function toEntity(value: string): Entity {
      return {
        value: value,
        synonyms: [value]
      };
    }
    // Generate item entities
    for (const item of items) {
      const entities: Entity[] = item.values.map(toEntity);
      await createEntity(item.name, entities);
    }
    // Generate param entities
    for (const param of params) {
      const entities: Entity[] = param.values.map(toEntity);
      await createEntity(`param_${param.name}`, entities);
    }
  }

  async function generateIntents(): Promise<void> {
    console.log();
  }

  export async function setup(): Promise<void> {
    await clearIntents();
    await clearEntities();
    await generateEntities();
    await generateIntents();
  }
}
