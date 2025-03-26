CREATE TABLE IF NOT EXISTS api_access_log (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  path VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  ip VARCHAR(50) NOT NULL,
  execution_time BIGINT NOT NULL,
  status_code INT NOT NULL,
  access_time DATETIME NOT NULL,
  request_params TEXT,
  user_agent VARCHAR(500)
);

CREATE INDEX idx_api_path ON api_access_log (path);
CREATE INDEX idx_api_access_time ON api_access_log (access_time);