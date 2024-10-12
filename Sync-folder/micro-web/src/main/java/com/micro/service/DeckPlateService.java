package com.micro.service;


import com.alibaba.fastjson.JSON;
import com.micro.model.common.DeckModel;
import com.micro.model.common.DeckRelatedModel;
import io.searchbox.client.JestClient;
import io.searchbox.client.JestResult;
import io.searchbox.core.Bulk;
import io.searchbox.core.Delete;
import io.searchbox.core.Index;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Collection;
import java.util.List;

@Service
public class DeckPlateService {
    private Logger logger = LoggerFactory.getLogger(DeckPlateService.class);
    @Resource
    private JestClient jestClient;

    public void deleteDeck(List<String> ids) {
        try {
            Bulk.Builder builder = new Bulk.Builder();
            for (String id : ids) {
                Delete delete = new Delete.Builder(id)
                        .index("vehicle_deck_read")
                        .type("hy_deck_record")
                        .build();
                builder.addAction(delete);
            }
            jestClient.execute(builder.build());
        } catch (Exception e) {
            e.printStackTrace();
            logger.info("deleteDeck error:" + e.getMessage());
        }
    }

    public String saveDeck(DeckModel deckModel) {
        try {
            Index index = new Index.Builder(JSON.toJSONString(deckModel))
                    .index("vehicle_deck_write")
                    .id(deckModel.getId())
                    .build();
            JestResult jestResult = jestClient.execute(index);
            if (jestResult != null && jestResult.isSucceeded()) {
                logger.info("saveDeck save success.");
                return deckModel.getId();
            } else {
                logger.info("saveDeck save error:" + jestResult.getErrorMessage());
                return "-1";
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.info("saveDeck save error:" + e.getMessage());
            return "-1";
        }
    }
    public boolean saveDecks(Collection<DeckModel> models) {
        try {
            Bulk.Builder builder = new Bulk.Builder();
            for (DeckModel model : models) {
                Index index = new Index.Builder(JSON.toJSONString(model))
                        .index("vehicle_deck_write")
                        .id(model.getId())
                        .build();
                builder.addAction(index);
            }
            JestResult jestResult = jestClient.execute(builder.build());
            if (jestResult != null && jestResult.isSucceeded()) {
                logger.info("saveDeck save success，numbers: {} ",models.size());
                return true;
            } else {
                logger.info("saveDeck save error:" + jestResult.getErrorMessage());
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.info("saveDeck save error:" + e.getMessage());
            return false;
        }
    }

    public void saveDeckRelated(List<DeckRelatedModel> models) {
        try {
            Bulk.Builder builder = new Bulk.Builder();
            for (DeckRelatedModel model : models) {
                Index index = new Index.Builder(JSON.toJSONString(model))
                        .index("vehicle_deck_related_read")
                        .id(model.getId())
                        .build();
                builder.addAction(index);
            }
            JestResult jestResult = jestClient.execute(builder.build());
            if (jestResult != null && jestResult.isSucceeded()) {
                logger.info("saveDeck relation save success");
            } else {
                logger.info("saveDeck relation save error:" + jestResult.getErrorMessage());
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.info("saveDeck relation save error:" + e.getMessage());
        }
    }

    public boolean saveDeckRelateds(List<DeckRelatedModel> models) {
        try {
            Bulk.Builder builder = new Bulk.Builder();
            for (DeckRelatedModel model : models) {
                Index index = new Index.Builder(JSON.toJSONString(model))
                        .index("vehicle_deck_related_read")
                        .id(model.getId())
                        .build();
                builder.addAction(index);
            }
            JestResult jestResult = jestClient.execute(builder.build());
            if (jestResult != null && jestResult.isSucceeded()) {
                logger.info("saveDeck relation save success，number: {}", models.size());
                return true;
            } else {
                logger.info("saveDeck relation save error:" + jestResult.getErrorMessage());
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.info("saveDeck relation save error:" + e.getMessage());
            return false;
        }
    }

    public String saveDeck(DeckModel deckModel, Boolean isMultiple) {
        if (isMultiple != null && isMultiple) {
            deckModel.setDeckStatus(101);
        } else if (isMultiple != null && !isMultiple) {
            deckModel.setDeckStatus(100);
        }
        try {
            Index index = new Index.Builder(JSON.toJSONString(deckModel))
                    .index("vehicle_deck_write")
                    .id(deckModel.getId())
                    .refresh(true)
                    .build();
            JestResult jestResult = jestClient.execute(index);
            if (jestResult != null && jestResult.isSucceeded()) {
                logger.info("saveDeck save success:【{}】", deckModel);
                return deckModel.getId();
            } else {
                logger.info("saveDeck save error:" + jestResult.getErrorMessage());
                return "-1";
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.info("saveDeck save error:" + e.getMessage());
            return "-1";
        }
    }
}
